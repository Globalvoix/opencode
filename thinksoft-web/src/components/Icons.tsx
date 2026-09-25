import React from 'react';

// Thinksoft app mark — same geometry as packages/ui/src/components/logo.tsx (Mark):
// a near-black rounded terminal badge with a prompt chevron and cursor block.
export function ThinksoftMarkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="3" width="14" height="14" rx="4" fill="#101014" stroke="white" strokeWidth="1" />
      <polyline
        points="6.4,7.6 9.4,10 6.4,12.4"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10" y="11" width="3.2" height="1.6" rx="0.8" fill="white" />
    </svg>
  );
}

// Thinksoft Spark / Sunburst Logo SVG
export function ThinksoftSparkIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16 2.5L18.1 11.2L25.8 6.5L20.8 13.8L29.5 16L20.8 18.2L25.8 25.5L18.1 20.8L16 29.5L13.9 20.8L6.2 25.5L11.2 18.2L2.5 16L11.2 13.8L6.2 6.5L13.9 11.2L16 2.5Z"
        fill="#D96B27"
      />
    </svg>
  );
}

// Windows 4-Square Logo
export function WindowsLogoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.527l.028 34.453L0 75.58V46.072zm4.183-39.011L88 0v41.213l-48.147.478zm48.147 43.194V88l-48.147-6.738-.047-34.806z" />
    </svg>
  );
}

// Apple / Mac Logo
export function AppleLogoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.17.65-2.84 1.44-.59.69-1.12 1.76-1.02 2.81 1.09.08 2.24-.59 2.85-1.38z" />
    </svg>
  );
}

// Linux Tux Penguin Logo
export function LinuxTuxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C9.5 2 8 3.5 8 6v4.5C6.5 11 5 12.5 5 15c0 3 1.5 4.5 3 4.5.3 0 .7-.1 1-.2C9.7 20.3 10.8 21 12 21s2.3-.7 3-1.7c.3.1.7.2 1 .2 1.5 0 3-1.5 3-4.5 0-2.5-1.5-4-3-4.5V6c0-2.5-1.5-4-4-4zm-1.8 4.2c.4 0 .7.3.7.8s-.3.8-.7.8-.8-.3-.8-.8.4-.8.8-.8zm3.6 0c.4 0 .8.3.8.8s-.4.8-.8.8-.7-.3-.7-.8.3-.8.7-.8zM12 8c.7 0 1.2.3 1.2.7 0 .5-.5.8-1.2.8s-1.2-.3-1.2-.8c0-.4.5-.7 1.2-.7zm0 3.5c2 0 3.5 2.2 3.5 5 0 1.8-.7 2.5-1.5 2.5s-1.2-.8-2-1.8c-.8 1-1.2 1.8-2 1.8s-1.5-.7-1.5-2.5c0-2.8 1.5-5 3.5-5z" />
    </svg>
  );
}
