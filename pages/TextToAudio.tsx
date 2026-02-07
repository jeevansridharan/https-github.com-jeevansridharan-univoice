import React, { useState } from 'react';

const TextToAudio: React.FC = () => {
    const [text, setText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    // Load available voices
    React.useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !voice) {
                setVoice(availableVoices[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, [voice]);

    const handleSpeak = () => {
        if (!text.trim()) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    const handleClear = () => {
        setText('');
        handleStop();
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Text to Audio</h1>
                    <p className="text-gray-400">Convert your text to natural-sounding speech</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
                    {/* Text Input */}
                    <div className="mb-6">
                        <label htmlFor="text-input" className="block text-sm font-semibold text-gray-300 mb-2">
                            Enter Text
                        </label>
                        <textarea
                            id="text-input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type or paste your text here..."
                            className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                                {text.length} characters
                            </p>
                            {text.length > 0 && (
                                <button
                                    onClick={handleClear}
                                    className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Voice Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Voice Selection */}
                        <div>
                            <label htmlFor="voice-select" className="block text-sm font-semibold text-gray-300 mb-2">
                                Voice
                            </label>
                            <select
                                id="voice-select"
                                value={voice?.name || ''}
                                onChange={(e) => {
                                    const selected = voices.find(v => v.name === e.target.value);
                                    if (selected) setVoice(selected);
                                }}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                {voices.map((v) => (
                                    <option key={v.name} value={v.name} className="bg-[#1a1a2e]">
                                        {v.name} ({v.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Speed Control */}
                        <div>
                            <label htmlFor="rate-slider" className="block text-sm font-semibold text-gray-300 mb-2">
                                Speed: {rate.toFixed(1)}x
                            </label>
                            <input
                                id="rate-slider"
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Pitch Control */}
                        <div>
                            <label htmlFor="pitch-slider" className="block text-sm font-semibold text-gray-300 mb-2">
                                Pitch: {pitch.toFixed(1)}
                            </label>
                            <input
                                id="pitch-slider"
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={isPlaying ? handleStop : handleSpeak}
                            disabled={!text.trim()}
                            className={`
                flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2
                ${isPlaying
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] text-white shadow-lg shadow-blue-500/30'
                                }
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
                        >
                            {isPlaying ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                    <span>Stop</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    <span>Play Audio</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm text-blue-200 font-medium">
                                Using Web Speech API
                            </p>
                            <p className="text-xs text-blue-300/70 mt-1">
                                This feature uses your browser's built-in text-to-speech engine. Available voices may vary by browser and operating system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToAudio;
