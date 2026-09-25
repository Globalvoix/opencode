import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface ApplyPageProps {
  onBack: () => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channelUrl: '',
    audienceSize: '< 10k',
    note: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', channelUrl: '', audienceSize: '< 10k', note: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col justify-between p-6 sm:p-12 md:p-16 selection:bg-[#141414] selection:text-white">
      {/* Top Bar with Minimal Back Action */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:text-[#141414] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>[back to home]</span>
        </button>
      </div>

      {/* Main Content Area - Exactly as shown in the design */}
      <main className="max-w-6xl w-full mx-auto my-auto py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141414]">
              Applications
            </h1>

            <p className="text-lg sm:text-xl font-medium text-neutral-600 mt-6 max-w-md leading-relaxed">
              Apply to programs designed for creators and builders.
            </p>
          </div>

          {/* Right Column - Creator Network Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-neutral-300/90 p-8 sm:p-10 bg-white hover:border-neutral-900 transition-colors flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414]">
                  Join Our Creator Network
                </h2>

                <p className="text-sm sm:text-base font-medium text-neutral-500 mt-3">
                  Create content. Grow together.
                </p>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mt-4">
                  We're looking for creators who love building and want to showcase Thinksoft to the world.
                </p>
              </div>

              <div className="pt-8 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#141414] hover:opacity-75 transition-opacity underline underline-offset-4 decoration-1 cursor-pointer group"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom spacer */}
      <div className="h-6" />

      {/* Creator Network Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#141414] p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#141414]">Application Received!</h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-sm">
                  Thank you for applying to the Thinksoft Creator Network. Our team will review your channel and reach out shortly.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#141414]">Creator Network Application</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Partner with Thinksoft to receive early API access, sponsorship grants, and developer perks.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Primary Channel / Portfolio URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://youtube.com/@channel or https://x.com/handle"
                      value={formData.channelUrl}
                      onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Audience Size</label>
                    <select
                      value={formData.audienceSize}
                      onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 bg-white"
                    >
                      <option value="< 10k">&lt; 10k subscribers / followers</option>
                      <option value="10k - 50k">10k - 50k subscribers / followers</option>
                      <option value="50k - 200k">50k - 200k subscribers / followers</option>
                      <option value="200k+">200k+ subscribers / followers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Brief Note / What do you build?</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about the software, tutorials, or developer content you create..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-[#141414] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-medium text-white bg-[#141414] hover:bg-black rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
