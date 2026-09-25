import React, { useEffect, useState } from 'react';
import { AppleLogoIcon, WindowsLogoIcon, LinuxTuxIcon } from './Icons';
import { Download as DownloadIcon, ArrowLeft } from 'lucide-react';
import {
  DESKTOP_VERSION,
  type Download,
  type Platform,
  PLATFORM_LABELS,
  PLATFORM_ORDER,
  detectPlatform,
  downloadUrl,
  downloadsFor,
  formatSize,
  recommendedDownload,
} from '../downloads';

interface DownloadPageProps {
  onBack: () => void;
  onTriggerDownload: (download: Download) => void;
}

const PLATFORM_ICON: Record<Platform, (props: { className?: string }) => React.ReactElement> = {
  macos: AppleLogoIcon,
  windows: WindowsLogoIcon,
  linux: LinuxTuxIcon,
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onBack, onTriggerDownload }) => {
  const [downloading, setDownloading] = useState<Download | null>(null)
  const visitorPlatform = detectPlatform()
  const recommended = recommendedDownload(visitorPlatform)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  useEffect(() => {
    if (!downloading) return;
    const timeout = setTimeout(() => setDownloading(null), 4000);
    return () => clearTimeout(timeout);
  }, [downloading]);

  const handleDownload = (download: Download) => {
    setDownloading(download);
    onTriggerDownload(download);
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] font-mono selection:bg-[#141414] selection:text-white flex flex-col justify-between p-6 sm:p-12 md:p-16">
      {/* Top Bar with Minimal Back Action */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:text-[#141414] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>[back to home]</span>
        </button>
        <span className="hidden sm:inline">thinksoft {DESKTOP_VERSION}</span>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414]">
            Download Thinksoft
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            {PLATFORM_LABELS[visitorPlatform]} detected · showing every published build below
          </p>
        </div>

        {/* Platform List */}
        <div className="space-y-10">
          {PLATFORM_ORDER.map((platform) => {
            const Icon = PLATFORM_ICON[platform];
            return (
              <div key={platform} className="border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-[#141414] shrink-0" />
                  <h2 className="text-base font-semibold tracking-tight text-[#141414]">
                    {PLATFORM_LABELS[platform]}
                  </h2>
                  {platform === visitorPlatform && (
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                      your platform
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                  {downloadsFor(platform).map((item) => (
                    <a
                      key={item.id}
                      href={downloadUrl(item)}
                      onClick={(event) => {
                        event.preventDefault();
                        handleDownload(item);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all duration-150 cursor-pointer active:scale-[0.99] group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#141414] group-hover:text-black flex items-center gap-2">
                          {item.title}
                          {item.id === recommended.id && (
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500">
                              recommended
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">
                          {item.hint} · {formatSize(item.size)}
                        </div>
                      </div>
                      <DownloadIcon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live download indicator toast inside page */}
        {downloading && (
          <div className="mt-8 p-3 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <span className="truncate">Downloading {downloading.title} · {formatSize(downloading.size)}</span>
            <span className="text-neutral-400 shrink-0">check browser downloads</span>
          </div>
        )}
      </div>
    </div>
  );
};
