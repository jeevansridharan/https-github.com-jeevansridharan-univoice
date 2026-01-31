
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppStatus, TranscriptEntry, FontSize } from './types';
import { createBlob, decode, decodeAudioData } from './utils/audio';
import TranscriptDisplay from './components/TranscriptDisplay';

const FONT_SIZES: { label: string; value: FontSize }[] = [
  { label: 'T1', value: 'text-xl' },
  { label: 'T2', value: 'text-2xl' },
  { label: 'T3', value: 'text-4xl' },
  { label: 'T4', value: 'text-6xl' },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [currentText, setCurrentText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<FontSize>('text-4xl');

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const stopListening = useCallback(() => {
    if (sessionRef.current) {
      try { sessionRef.current.close?.(); } catch (e) {}
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setStatus(AppStatus.IDLE);
    setCurrentText('');
  }, []);

  const startListening = async () => {
    try {
      setStatus(AppStatus.CONNECTING);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a real-time transcription bridge for the deaf. Listen and transcribe verbatim. Focus on speed and accuracy. Provide output via inputAudioTranscription.',
        },
        callbacks: {
          onopen: () => {
            setStatus(AppStatus.LISTENING);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) setCurrentText(prev => prev + text);
            }

            if (message.serverContent?.turnComplete) {
              setCurrentText(prev => {
                const trimmed = prev.trim();
                if (trimmed) {
                  setEntries(current => [...current, {
                    id: crypto.randomUUID(),
                    text: trimmed,
                    timestamp: Date.now(),
                    isFinal: true
                  }]);
                }
                return '';
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.start();
            }
          },
          onerror: (err: any) => {
            setError(err?.message || 'Connection error');
            if (err?.message?.includes('Requested entity was not found')) setHasKey(false);
            stopListening();
          },
          onclose: () => stopListening()
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize session.');
      setStatus(AppStatus.IDLE);
      if (err.message?.includes('Requested entity was not found')) setHasKey(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-[#0a0a1a] overflow-hidden relative border-x border-white/5">
      {/* Dynamic Header */}
      <header className="px-6 py-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-xl z-20">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-2xl ${status === AppStatus.LISTENING ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Lumina</h1>
            <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase leading-none mt-1">Live Assist</p>
          </div>
        </div>

        {/* Font Scaling Controls */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          {FONT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => setFontSize(size.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fontSize === size.value ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </header>

      {/* API Key Modal/Alert */}
      {!hasKey && (
        <div className="mx-6 mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
             <p className="text-sm font-semibold text-yellow-100">Paid API Key Required for Live API</p>
          </div>
          <button onClick={handleOpenKeyDialog} className="px-4 py-2 bg-yellow-500 text-black text-xs font-black rounded-xl uppercase">Setup</button>
        </div>
      )}

      {/* Main View */}
      <TranscriptDisplay entries={entries} currentText={currentText} fontSize={fontSize} />

      {/* Bottom Interface */}
      <footer className="px-8 py-10 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between shrink-0 relative z-10">
        <button 
          onClick={() => setEntries([])}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <button
          onClick={status === AppStatus.LISTENING || status === AppStatus.CONNECTING ? stopListening : startListening}
          disabled={!hasKey && status === AppStatus.IDLE}
          className={`
            relative flex items-center justify-center
            w-24 h-24 rounded-[32px] transition-all duration-300 transform active:scale-90
            ${!hasKey && status === AppStatus.IDLE ? 'bg-gray-800 opacity-50 cursor-not-allowed' : 
              status === AppStatus.LISTENING 
              ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
              : 'bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105'}
          `}
        >
          {status === AppStatus.LISTENING && (
            <div className="absolute inset-0 rounded-[32px] border-4 border-red-500 animate-ping opacity-30" />
          )}
          
          {status === AppStatus.LISTENING ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ) : status === AppStatus.CONNECTING ? (
            <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="w-14" /> {/* Spacer for balance */}
      </footer>

      {/* Real-time Status Overlay */}
      {status === AppStatus.LISTENING && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="w-1 bg-blue-500 rounded-full animate-pulse" 
              style={{ 
                height: `${Math.random() * 20 + 5}px`, 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
