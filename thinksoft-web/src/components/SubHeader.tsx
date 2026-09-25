import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Monitor, Globe, Apple, Download as DownloadIcon } from 'lucide-react';
import { type Download, PLATFORM_LABELS, downloadUrl, formatSize, recommendedDownload } from '../downloads';

interface SubHeaderProps {
  onDownload: (download: Download) => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ onDownload }) => {
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative border-t border-[#EAE3D6] border-b border-[#EAE3D6]/70 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-12 flex items-center justify-between text-sm">
        {/* Left: Download breadcrumb */}
        <div className="text-[#5B6270] font-normal tracking-wide text-[14px]">
          Download
        </div>

        {/* Right: Explore here dropdown */}
        <div className="relative" ref={exploreRef}>
          <button
            onClick={() => setExploreOpen(!exploreOpen)}
            aria-expanded={exploreOpen}
            className="flex items-center gap-1 text-[#5B6270] hover:text-[#141414] transition-colors cursor-pointer text-[14px] font-normal py-1"
          >
            <span>Explore here</span>
            <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
              exploreOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {exploreOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EBE6DC] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider px-3 py-1 mb-1">
                Download Platforms
              </div>

              {(['windows', 'macos', 'linux'] as const).map((platform) => {
                const recommended = recommendedDownload(platform);
                return (
                  <a
                    key={platform}
                    href={downloadUrl(recommended)}
                    onClick={(event) => {
                      event.preventDefault();
                      onDownload(recommended);
                      setExploreOpen(false);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors cursor-pointer"
                  >
                    {platform === 'macos' ? (
                      <Apple className="w-4 h-4 text-[#141414]" />
                    ) : platform === 'linux' ? (
                      <DownloadIcon className="w-4 h-4 text-[#141414]" />
                    ) : (
                      <Monitor className="w-4 h-4 text-[#141414]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#141414]">
                        Thinksoft for {PLATFORM_LABELS[platform]} · {recommended.detail}
                      </div>
                      <div className="text-[11px] text-[#6B7280] truncate">
                        {formatSize(recommended.size)} · {recommended.hint}
                      </div>
                    </div>
                  </a>
                );
              })}

              <div className="border-t border-[#EBE6DC] my-2" />

              <a
                href="https://thinksoft.dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#D96B27]" />
                <div className="text-xs font-medium text-[#141414]">Thinksoft on the web</div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
