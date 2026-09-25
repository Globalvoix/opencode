import React from 'react';

export const DeviceShowcase: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] sm:h-[440px] flex items-center justify-center select-none">
      {/* Ambient device lighting glow */}
      <div className="absolute w-[360px] h-[220px] bg-gradient-to-tr from-pink-500/15 via-indigo-500/15 to-blue-500/20 blur-3xl pointer-events-none" />

      {/* Container aligning the overlapping devices */}
      <div className="relative flex items-center justify-center">

        {/* 1. Frosted Glass Laptop (Background / Center-Left) */}
        <div className="relative z-10 flex flex-col items-center -translate-x-6 sm:-translate-x-10 transition-transform duration-300 hover:scale-[1.01]">
          {/* Laptop Screen Lid */}
          <div className="w-[330px] sm:w-[410px] h-[210px] sm:h-[250px] rounded-2xl sm:rounded-[22px] border border-white/20 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] backdrop-blur-xl shadow-2xl p-3 sm:p-4 flex flex-col relative overflow-hidden">
            {/* Top glass reflection sheen */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            {/* Laptop Camera Notch / Island */}
            <div className="w-10 sm:w-12 h-2.5 bg-black/40 rounded-full mx-auto mb-2 border border-white/10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
            </div>

            {/* Window Header Bar Wireframe */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 px-1">
              {/* Traffic control pills */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 sm:w-5 h-1.5 rounded-full bg-white/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Tabs wireframe */}
              <div className="flex items-center gap-2">
                <span className="w-12 sm:w-16 h-1.5 rounded-full bg-white/15" />
                <span className="w-8 sm:w-10 h-1.5 rounded-full bg-white/10" />
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
              </div>
            </div>

            {/* Laptop Inner Screen Layout Wireframe */}
            <div className="flex-1 grid grid-cols-12 gap-2 sm:gap-3">
              {/* Left Column (Sidebar / Project List) */}
              <div className="col-span-4 flex flex-col gap-2">
                <div className="h-6 sm:h-7 rounded-lg bg-white/[0.07] border border-white/10 p-1.5 flex items-center">
                  <span className="w-8 h-1.5 rounded-full bg-white/20" />
                </div>
                <div className="h-12 sm:h-16 rounded-lg bg-white/[0.05] border border-white/10 p-2 flex flex-col justify-around">
                  <span className="w-12 h-1.5 rounded-full bg-white/25" />
                  <span className="w-16 h-1.5 rounded-full bg-white/15" />
                </div>
                <div className="flex-1 rounded-lg bg-white/[0.05] border border-white/10 p-2 flex flex-col justify-around">
                  <span className="w-10 h-1.5 rounded-full bg-white/25" />
                  <span className="w-14 h-1.5 rounded-full bg-white/15" />
                </div>
              </div>

              {/* Main Center Area (Code / Canvas Workspace) */}
              <div className="col-span-8 rounded-xl bg-white/[0.04] border border-white/10 p-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-20 h-2 bg-white/20 rounded-full" />
                  <div className="w-32 h-1.5 bg-white/15 rounded-full" />
                  <div className="w-24 h-1.5 bg-white/10 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-10 sm:h-14 rounded-lg bg-white/[0.04] border border-white/10" />
                  <div className="h-10 sm:h-14 rounded-lg bg-white/[0.04] border border-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Base (Hinged Bottom Lip) */}
          <div className="w-[360px] sm:w-[450px] h-3.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-b-2xl border-t border-white/25 shadow-xl relative -mt-0.5 flex justify-center">
            {/* Center thumb groove */}
            <div className="w-12 sm:w-16 h-1.5 bg-black/40 rounded-b-md border-b border-white/10" />
          </div>
        </div>

        {/* 2. Frosted Glass Smartphone (Foreground / Shifted Right) */}
        <div className="absolute right-0 sm:right-2 bottom-0 sm:bottom-1 z-20 transition-transform duration-300 hover:scale-[1.02]">
          {/* Glowing Neon Rim Gradient Wrapper */}
          <div className="p-[1.6px] rounded-[34px] bg-gradient-to-tr from-[#F43F5E] via-[#8B5CF6] to-[#38BDF8] shadow-[0_0_35px_rgba(244,63,94,0.35),0_0_35px_rgba(56,189,248,0.25)]">
            {/* Phone Body with Frosted Glass Interior */}
            <div className="w-[150px] sm:w-[175px] h-[280px] sm:h-[315px] bg-[#121319]/90 backdrop-blur-2xl rounded-[32.4px] p-3 sm:p-3.5 flex flex-col justify-between border border-white/10 relative overflow-hidden">
              {/* Bottom pink rim light reflection */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#F43F5E]/30 blur-xl pointer-events-none rounded-full" />
              {/* Top blue rim light reflection */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#38BDF8]/25 blur-xl pointer-events-none rounded-full" />

              {/* Dynamic Island Pill Notch */}
              <div className="w-10 sm:w-12 h-2.5 bg-black/50 border border-white/15 rounded-full mx-auto shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Mobile Screen Wireframe Content */}
              <div className="flex-1 flex flex-col justify-center space-y-2.5 my-2">
                {/* Greeting / title line */}
                <div className="w-14 sm:w-16 h-2 bg-white/20 rounded-full mx-1" />

                {/* Card Bubble 1 */}
                <div className="h-8 sm:h-9 rounded-xl bg-white/[0.07] border border-white/10 p-2 flex items-center">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Card Bubble 2 (Taller) */}
                <div className="h-12 sm:h-14 rounded-xl bg-white/[0.07] border border-white/10 p-2 flex flex-col justify-around">
                  <div className="w-16 sm:w-20 h-1.5 bg-white/25 rounded-full" />
                  <div className="w-10 sm:w-12 h-1.5 bg-white/15 rounded-full" />
                </div>

                {/* Card Bubble 3 */}
                <div className="h-8 sm:h-9 rounded-xl bg-white/[0.07] border border-white/10 p-2 flex items-center">
                  <div className="w-14 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Bottom Action Bar */}
                <div className="h-10 sm:h-11 rounded-xl bg-gradient-to-r from-[#F43F5E]/20 via-[#8B5CF6]/15 to-white/5 border border-white/15 p-2 flex items-center justify-between">
                  <div className="w-14 h-1.5 bg-white/30 rounded-full" />
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto shrink-0 mt-0.5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
