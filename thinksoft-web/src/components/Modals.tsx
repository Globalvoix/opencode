import React, { useState } from 'react';
import { X, Download, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ThinksoftSparkIcon } from './Icons';

// Toast Notification for Downloads
export const DownloadToast: React.FC<{
  fileName: string;
  architecture: string;
  onClose: () => void;
}> = ({ fileName, architecture, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#141414] text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-10 h-10 rounded-xl bg-[#D96B27]/20 flex items-center justify-center shrink-0">
        <Download className="w-5 h-5 text-[#D96B27] animate-bounce" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>Starting Download</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
            {architecture}
          </span>
        </div>
        <div className="text-xs text-gray-300 truncate mt-0.5">{fileName}</div>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Login Modal
export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-200 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <ThinksoftSparkIcon className="w-10 h-10 text-[#D96B27]" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#141414]">Welcome back to Thinksoft</h2>
        <p className="text-xs text-gray-600 mt-1 mb-6">Log in to your account or start a new workspace</p>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm space-y-2">
            <div className="font-semibold">Check your inbox</div>
            <div className="text-xs">We sent a temporary login code to {email}.</div>
            <button onClick={() => setSent(false)} className="text-xs underline text-emerald-900 font-medium pt-2 block">
              Try a different email
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setSent(true)}
              className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#141414] hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter work email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DCD5C7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D96B27]/40"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#141414] text-white rounded-xl text-sm font-semibold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                Continue with Email
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
