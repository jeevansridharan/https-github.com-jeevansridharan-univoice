import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TranscriptItem {
    id: string;
    content: string;
    created_at: string;
}

const History: React.FC = () => {
    const { user } = useAuth();
    const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            if (!user) return;

            const { data, error } = await supabase
                .from('transcripts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setTranscripts(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('transcripts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setTranscripts(transcripts.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting transcript:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">History</h1>
                        <p className="text-gray-400">Your past conversations and transcripts</p>
                    </div>
                    <button
                        onClick={fetchHistory}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : transcripts.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">No History Yet</h3>
                        <p className="text-gray-400">Your transcripts will appear here automatically.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transcripts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-2xl p-6 transition-all group relative"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-wide">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-200 leading-relaxed font-medium">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
