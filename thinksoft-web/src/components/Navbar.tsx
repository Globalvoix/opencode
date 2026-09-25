import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenContactSales: () => void;
  onOpenTryThinksoft: () => void;
  onOpenGateway?: () => void;
  onOpenApply?: () => void;
  onMenuStateChange?: (isOpen: boolean) => void;
  onNavigateDownload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContactSales,
  onOpenTryThinksoft,
  onOpenGateway,
  onOpenApply,
  onMenuStateChange,
  onNavigateDownload,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDropdown = (menu: string | null) => {
    setActiveDropdown(menu);
    onMenuStateChange?.(menu === 'product');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        updateDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleProductMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateDropdown('product');
  };

  const handleProductMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      updateDropdown(null);
    }, 220);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      updateDropdown(null);
    }, 220);
  };

  const toggleProductDropdown = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateDropdown(activeDropdown === 'product' ? null : 'product');
  };

  return (
    <header className="relative z-50 bg-white border-b border-gray-100" ref={navRef}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <a href="#" className="group transition-opacity hover:opacity-90">
            <span className="text-[24px] tracking-tight text-[#141414] font-bold leading-none select-none">
              Thinksoft
            </span>
          </a>
        </div>

        {/* Center: Navigation Options (Product, Doc, Apply) */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium text-[#4B5563]">
          {/* 1. Product (opens mega-menu on click or hover) */}
          <div
            className="relative"
            onMouseEnter={handleProductMouseEnter}
            onMouseLeave={handleProductMouseLeave}
          >
            <button
              onClick={toggleProductDropdown}
              className={`py-2 transition-colors cursor-pointer select-none ${
                activeDropdown === 'product' ? 'text-[#000000] font-semibold' : 'hover:text-[#141414]'
              }`}
            >
              <span>AI gateway</span>
            </button>
          </div>

          {/* 1b. Download */}
          <button
            onClick={() => {
              updateDropdown(null);
              onNavigateDownload?.();
            }}
            className="py-2 transition-colors hover:text-[#141414] cursor-pointer"
          >
            Download
          </button>

          {/* 2. Doc */}
          <a
            href="#documentation"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 750, behavior: 'smooth' });
            }}
            className="py-2 transition-colors hover:text-[#141414] cursor-pointer"
          >
            Doc
          </a>

          {/* 3. Apply */}
          <button
            onClick={onOpenApply || onOpenContactSales}
            className="py-2 transition-colors hover:text-[#141414] cursor-pointer"
          >
            Apply
          </button>
        </nav>

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

      {/* Blurred Backdrop covering the page beneath the header */}
      <div
        onClick={() => updateDropdown(null)}
        className={`hidden lg:block fixed inset-x-0 bottom-0 top-20 bg-black/25 backdrop-blur-md transition-all duration-300 pointer-events-auto z-40 ${
          activeDropdown === 'product'
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      />

      {/* Mega Menu Dropdown with smooth animated entrance */}
      <div
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
        className={`hidden lg:block absolute top-full left-0 w-full bg-white border-b border-gray-200/90 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] z-50 transition-all duration-300 ease-out origin-top ${
          activeDropdown === 'product'
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-3 invisible pointer-events-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-9 pb-16">
          <div className="grid grid-cols-12 gap-10">
            {/* Left Column: Explore Products */}
            <div className="col-span-4">
              <div className="text-[13px] font-normal text-[#6E6E73] mb-6 tracking-tight">
                Explore Products
              </div>
              <div className="flex flex-col items-start gap-4">
                <button
                  onClick={() => {
                    (onOpenGateway || onOpenContactSales)();
                    updateDropdown(null);
                  }}
                  className="group inline-flex items-center gap-2 text-[32px] sm:text-[36px] font-medium text-[#000000] tracking-tight leading-tight hover:opacity-70 transition-all cursor-pointer text-left"
                >
                  <span>AI gateway</span>
                  <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>                <button
                  onClick={() => {
                    onOpenTryThinksoft();
                    updateDropdown(null);
                  }}
                  className="group inline-flex items-center gap-2 text-[32px] sm:text-[36px] font-medium text-[#000000] tracking-tight leading-tight hover:opacity-70 transition-all cursor-pointer text-left"
                >
                  <span>Thinksoft</span>
                  <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 font-medium text-[#374151]">
            <button
              onClick={() => {
                setActiveDropdown(activeDropdown === 'm-product' ? null : 'm-product');
              }}
              className="flex items-center justify-between py-2 text-left"
            >
              <span>AI gateway</span>
              <span className={`text-xs transition-transform duration-150 ${activeDropdown === 'm-product' ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {activeDropdown === 'm-product' && (
              <div className="pl-3 pb-3 flex flex-col gap-4 text-sm bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <div>
                  <div className="text-xs font-medium text-[#6E6E73] mb-2">Explore Products</div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        (onOpenGateway || onOpenContactSales)();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left font-semibold text-xl text-black hover:opacity-75 flex items-center gap-1"
                    >
                      <span>AI gateway</span>
                      <span className="text-base">↗</span>
                    </button>                    <button
                      onClick={() => {
                        onOpenTryThinksoft();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left font-semibold text-xl text-black hover:opacity-75 flex items-center gap-1"
                    >
                      <span>Thinksoft</span>
                      <span className="text-base">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <a
              href="#documentation"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.scrollTo({ top: 750, behavior: 'smooth' });
              }}
              className="py-2 text-left hover:text-[#141414]"
            >
              Doc
            </a>

            <button
              onClick={() => {
                if (onOpenApply) {
                  onOpenApply();
                } else {
                  onOpenContactSales();
                }
                setMobileMenuOpen(false);
              }}
              className="py-2 text-left hover:text-[#141414]"
            >
              Apply
            </button>

            <button
              onClick={() => {
                onNavigateDownload?.();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-left hover:text-[#141414]"
            >
              Download
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
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
