import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenContactSales: () => void;
  onOpenTryThinksoft: () => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContactSales,
  onOpenTryThinksoft,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <a href="#" className="group transition-opacity hover:opacity-90">
            <span className="text-[24px] tracking-tight text-[#141414] font-bold leading-none select-none">
              Thinksoft
            </span>
          </a>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenContactSales}
            className="px-3.5 py-1.5 border border-gray-200 bg-white text-[#141414] hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
          >
            Contact sales
          </button>
          <button
            onClick={onOpenTryThinksoft}
            className="px-3.5 py-1.5 bg-[#141414] text-white hover:bg-black rounded-lg text-[13px] font-medium transition-all cursor-pointer shadow-xs hover:shadow active:scale-[0.98]"
          >
            Try Thinksoft
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#141414] hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenContactSales();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 border border-gray-200 bg-white text-[#141414] rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Contact sales
            </button>
            <button
              onClick={() => {
                onOpenTryThinksoft();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#141414] text-white rounded-lg text-sm font-semibold hover:bg-black"
            >
              Try Thinksoft
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
