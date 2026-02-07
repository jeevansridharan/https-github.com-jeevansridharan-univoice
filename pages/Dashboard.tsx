import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AudioToText from './AudioToText';
import TextToAudio from './TextToAudio';
import History from './History';
import Profile from './Profile';

const Dashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0a0a1a] overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Mobile Header */}
                <header className="lg:hidden bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-black text-white">Lumina</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard/audio-to-text" replace />} />
                        <Route path="/audio-to-text" element={<AudioToText />} />
                        <Route path="/text-to-audio" element={<TextToAudio />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
