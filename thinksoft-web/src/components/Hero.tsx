import React from 'react';
import { WindowsLogoIcon, AppleLogoIcon } from './Icons';

interface HeroProps {
  onOpenDownload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDownload }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 sm:pt-28 sm:pb-36 max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-5xl sm:text-6xl md:text-[64px] leading-[1.12] tracking-[-0.03em] text-[#141414] font-semibold select-none">
        Thinksoft, the AI
        <br />
        software engineer
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-[#374151] font-normal tracking-tight max-w-2xl leading-relaxed">
        Think, hand off tasks, and code, all in one place.
      </p>

      {/* Download Action Buttons */}
      <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        {/* Primary Download for Windows */}
        <button
          onClick={onOpenDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#141414] text-white hover:bg-[#2A2A2A] px-4.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.98]"
        >
          <WindowsLogoIcon className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>Download for Windows</span>
        </button>

        {/* Secondary Mac Download */}
        <button
          onClick={onOpenDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-gray-200 hover:border-gray-300 text-[#374151] hover:text-[#141414] hover:bg-gray-100 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.98]"
        >
          <AppleLogoIcon className="w-3.5 h-3.5 fill-current text-[#4B5563] shrink-0 -translate-y-px" />
          <span>Mac ( silicon )</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-[#6B7280]">
        Also available for Intel Macs and Linux · all builds on the download page
      </p>
    </main>
  );
};
