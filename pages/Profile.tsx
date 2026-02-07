import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Profile</h1>
                    <p className="text-gray-400">Manage your account settings</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-white/10">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-3xl font-bold">
                                {user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {user?.email?.split('@')[0]}
                            </h2>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                {user?.email}
                            </div>
                        </div>

                        {/* User ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                User ID
                            </label>
                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm font-mono">
                                {user?.id}
                            </div>
                        </div>

                        {/* Account Created */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Account Created
                            </label>
                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 font-bold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                <span>Logging out...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm text-blue-200 font-medium">
                                Your account is secured with Supabase Authentication
                            </p>
                            <p className="text-xs text-blue-300/70 mt-1">
                                All your data is encrypted and stored securely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
