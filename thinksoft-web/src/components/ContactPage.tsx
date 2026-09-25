import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141414]">
              Contact Us
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] mt-10 md:mt-12">
              Get in touch with the Thinksoft team
            </h2>

            <p className="text-sm sm:text-base text-[#141414] leading-relaxed mt-4 max-w-lg">
              Have a question, feedback, or need help? We're here to assist. Whether you need support, have a partnership inquiry, or just want to learn more about Thinksoft, we'd love to hear from you.
            </p>
          </div>

          {/* Right Column */}
          <div className="md:pt-2">
            <a
              href="mailto:info@thinksoft.dev"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] hover:opacity-80 transition-opacity underline underline-offset-8 decoration-2 break-all sm:break-normal inline-block"
            >
              info@thinksoft.dev
            </a>
          </div>
        </div>
      </main>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
};
