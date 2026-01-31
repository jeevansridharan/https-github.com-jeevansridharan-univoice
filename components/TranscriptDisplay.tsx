
import React, { useEffect, useRef } from 'react';
import { TranscriptEntry, FontSize } from '../types';

interface TranscriptDisplayProps {
  entries: TranscriptEntry[];
  currentText: string;
  fontSize: FontSize;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ entries, currentText, fontSize }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, currentText]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 scrollbar-hide">
      {entries.length === 0 && !currentText && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">Listening Mode Ready</p>
            <p className="text-gray-400 max-w-sm text-lg leading-relaxed">
              Position the phone towards the speaker. Words will appear here in real-time.
            </p>
          </div>
        </div>
      )}

      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all hover:bg-white/[0.05]">
            <p className={`${fontSize} font-bold leading-tight text-blue-50 tracking-tight`}>
              {entry.text}
            </p>
            <div className="flex items-center mt-4 space-x-2 opacity-40">
              <span className="text-sm font-medium text-blue-400">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {currentText && (
        <div className="animate-in fade-in duration-200">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-8 shadow-inner">
            <p className={`${fontSize} font-bold leading-tight text-blue-100 italic tracking-tight`}>
              {currentText}
              <span className="inline-block w-2 h-10 bg-blue-400 ml-2 animate-pulse rounded-full align-middle shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </p>
          </div>
        </div>
      )}
      
      <div ref={endRef} className="h-32" />
    </div>
  );
};

export default TranscriptDisplay;
