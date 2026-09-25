import React from 'react';

interface FooterProps {
  onGetStarted?: () => void;
  onContact?: () => void;
  onPrivacy?: () => void;
  onTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGetStarted, onContact, onPrivacy, onTerms }) => {
  return (
    <footer className="w-full bg-white text-[#141414] pt-20 sm:pt-28 pb-12 sm:pb-16 border-t border-gray-200/60">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Main CTA Section */}
        <div className="flex flex-col items-start pb-16 sm:pb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold tracking-[-0.03em] text-[#141414] leading-[1.18]">
            Build more with
            <br />
            <span className="text-[#1A18F7]">Thinksoft</span>
          </h2>

          <div className="mt-7 sm:mt-8">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-[#141414] hover:bg-black text-white text-sm font-semibold rounded-md shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Bottom Legal & Social Links Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 text-sm font-medium text-[#141414]">
          {/* Left: Privacy & Terms */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button onClick={onPrivacy} className="hover:text-gray-600 transition-colors cursor-pointer text-left">
              Privacy policy
            </button>
            <button onClick={onTerms} className="hover:text-gray-600 transition-colors cursor-pointer text-left">
              Terms of service
            </button>

            {onContact && (
              <button onClick={onContact} className="hover:text-gray-600 transition-colors cursor-pointer text-left">
                Contact sales
              </button>
            )}
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Linkedin
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              X (Twitter)
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
