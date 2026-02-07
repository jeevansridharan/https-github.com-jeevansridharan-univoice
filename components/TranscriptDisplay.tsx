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
    <div className="flex-1 px-4 md:px-8 py-6 overflow-hidden flex flex-col">
      {/* Main Text Box Container */}
      <div className="flex-1 bg-black/40 border-2 border-white/10 rounded-3xl overflow-hidden relative shadow-inner flex flex-col">

        {/* Header/Label for the text box */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Transcript</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" />
            <span className="text-[10px] text-red-400/70 font-mono">REC</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

          {entries.length === 0 && !currentText && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-sm font-medium">Waiting for speech...</p>
            </div>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="animate-in fade-in duration-300">
              <p className={`${fontSize} font-medium leading-relaxed text-gray-200 tracking-wide`}>
                {entry.text}
              </p>
            </div>
          ))}

          {currentText && (
            <div className="animate-in fade-in duration-200">
              <p className={`${fontSize} font-medium leading-relaxed text-blue-300/90 tracking-wide`}>
                {currentText}
                <span className="inline-block w-2 h-[1em] bg-blue-500/50 ml-1 animate-pulse align-middle" />
              </p>
            </div>
          )}

          <div ref={endRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
