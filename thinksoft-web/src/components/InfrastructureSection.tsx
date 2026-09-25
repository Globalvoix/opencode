import React from 'react';
import { ThinksoftMarkIcon } from './Icons';

export const InfrastructureSection: React.FC = () => {
  return (
    <section className="w-full max-w-[99%] 2xl:max-w-[1960px] mx-auto px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6">
      {/* Dark Container with sleek, slightly softened corners and wide canvas */}
      <div className="bg-[#0B0C0E] text-white rounded-2xl sm:rounded-[22px] p-6 sm:p-12 lg:p-16 xl:p-20 shadow-2xl border border-white/[0.07] relative overflow-hidden">
        {/* Subtle radial ambient background lights */}
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[600px] bg-blue-500/5 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[600px] bg-pink-500/5 blur-[180px] pointer-events-none rounded-full" />

        {/* Centered Content Column */}
        <div className="max-w-[780px] sm:max-w-[820px] mx-auto relative z-10">

          {/* Section Top Header */}
          <div className="mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-[32px] font-bold tracking-tight text-white leading-tight">
              Built to drive real engineering work
            </h2>
            <p className="mt-3 text-[14px] sm:text-[15px] text-[#A1A1A1] leading-relaxed font-normal max-w-lg">
              Thinksoft plans the change, makes the edits and runs the commands on your own machine. It works in the desktop app and in the terminal, on whichever model you already pay for.
            </p>
          </div>

          {/* Vertically Stacked Showcase Features in the Center */}
          <div className="flex flex-col gap-16 sm:gap-20">

            {/* Feature 1: The desktop app */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight">
                  Built for the way you work
                </h3>
                <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#A1A1A1] leading-relaxed font-normal max-w-md">
                  Vertical tabs keep every session one click away. Start from a prompt, watch the edits land, then read the diff before you keep it.
                </p>
              </div>

              {/* Visual Showcase Box: the Thinksoft desktop app, filling the frame */}
              <div className="relative w-full bg-[#0E0F12] border border-white/[0.08] rounded-xl sm:rounded-[18px] overflow-hidden group">
                <img
                  src="/thinksoft-app.png"
                  alt="The Thinksoft desktop app, showing vertical session tabs and the new-session composer"
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

            {/* Feature 2: Your model, your key */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight">
                  Your model, your key
                </h3>
                <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#A1A1A1] leading-relaxed font-normal max-w-md">
                  Bring a key for the provider you already pay for, or point Thinksoft at a local model. One agent, every backend, no lock-in.
                </p>
              </div>

              {/* Visual Showcase Box: provider grid with Thinksoft in the middle */}
              <div className="relative w-full bg-[#121317] border border-white/[0.08] rounded-xl sm:rounded-[18px] p-6 sm:p-10 flex items-center justify-center min-h-[420px] sm:min-h-[460px] overflow-hidden group">
                <div className="absolute w-[260px] h-[260px] bg-gradient-to-tr from-[#1A18F7] via-[#6366F1] to-[#06B6D4] rounded-full blur-[90px] opacity-50 pointer-events-none" />

                <div className="relative grid grid-cols-5 gap-2.5 sm:gap-3.5 z-10">
                  {/* Row 1 */}
                  <StackTile icon={<TelegramIcon />} opacity="opacity-30" />
                  <StackTile icon={<PauseIcon />} opacity="opacity-30" />
                  <StackTile icon={<SalesforceIcon />} opacity="opacity-40" />
                  <StackTile icon={<SlackIcon />} opacity="opacity-40" />
                  <StackTile icon={<HubSpotIcon />} opacity="opacity-30" />

                  {/* Row 2 */}
                  <StackTile icon={<ArcIcon />} opacity="opacity-40" />
                  <StackTile icon={<LinearIcon />} opacity="opacity-50" />
                  <StackTile icon={<FirebaseIcon />} opacity="opacity-75" />
                  <StackTile icon={<GoogleDriveIcon />} opacity="opacity-95" />
                  <StackTile icon={<TeamsIcon />} opacity="opacity-90" />

                  {/* Row 3 - Center Row with Thinksoft in Middle */}
                  <StackTile icon={<TwitchIcon />} opacity="opacity-40" />
                  <StackTile icon={<StripeIcon />} opacity="opacity-75" />

                  {/* Center Thinksoft tile, using the app mark */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl p-[1.5px] bg-gradient-to-br from-[#1A18F7] via-[#4F46E5] to-[#06B6D4] shadow-[0_0_45px_rgba(26,24,247,0.8)] hover:scale-110 transition-transform duration-200 cursor-pointer flex items-center justify-center">
                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#0E0F12] flex items-center justify-center">
                      <ThinksoftMarkIcon className="w-6 h-6" />
                    </div>
                  </div>

                  <StackTile icon={<SupabaseIcon />} opacity="opacity-95" />

                  {/* Row 4 */}
                  <StackTile icon={<DatabricksIcon />} opacity="opacity-60" />
                  <StackTile icon={<NotionIcon />} opacity="opacity-80" />
                  <StackTile icon={<GmailIcon />} opacity="opacity-95" />
                  <StackTile icon={<GoogleCloudIcon />} opacity="opacity-90" />
                  <StackTile icon={<ShopifyIcon />} opacity="opacity-95" />

                  {/* Row 5 */}
                  <StackTile icon={<GitHubIcon />} opacity="opacity-40" />
                  <StackTile icon={<GitLabIcon />} opacity="opacity-40" />
                  <StackTile icon={<VercelIcon />} opacity="opacity-50" />
                  <StackTile icon={<PostgresIcon />} opacity="opacity-40" />
                  <StackTile icon={<OpenAIIcon />} opacity="opacity-30" />
                </div>

                {/* Edge fade gradient mask so outer icons dissolve smoothly into dark background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-transparent to-[#121317] pointer-events-none opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121317] via-transparent to-[#121317] pointer-events-none opacity-40" />
              </div>
            </div>

            {/* Feature 3: the built-in browser */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight">
                  See it in a built-in browser
                </h3>
                <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#A1A1A1] leading-relaxed font-normal max-w-md">
                  Thinksoft ships with its own browser, so the agent can open the app, click through it and check the result without leaving the session or opening a second window.
                </p>
              </div>

              {/* Visual Showcase Box: the built-in browser, filling the frame */}
              <div className="relative w-full bg-[#0E0F12] border border-white/[0.08] rounded-xl sm:rounded-[18px] overflow-hidden group">
                <img
                  src="/thinksoft-browser.png"
                  alt="The built-in browser inside a Thinksoft session, with a page open in the Browser tab"
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

            {/* Feature 4: Free and cheap models */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight">
                  Free models, or nearly free
                </h3>
                <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#A1A1A1] leading-relaxed font-normal max-w-md">
                  Start on a free model and pay only when a task needs more. Filter the picker by cost, see what a run costs before you start,
                  and switch models mid-session when something bigger is worth it.
                </p>
              </div>

              {/* Visual Showcase Box: connecting a provider, filling the frame */}
              <div className="relative w-full bg-[#0E0F12] border border-white/[0.08] rounded-xl sm:rounded-[18px] overflow-hidden group">
                <img
                  src="/thinksoft-models.png"
                  alt="The Connect provider dialog in Thinksoft, listing Anthropic, OpenAI, Google, OpenRouter and more"
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-component for each grid tile
const StackTile: React.FC<{ icon: React.ReactNode; opacity?: string }> = ({ icon, opacity = "opacity-60" }) => {
  return (
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#181920] border border-white/[0.08] flex items-center justify-center p-2.5 sm:p-3 transition-all duration-200 hover:scale-105 hover:border-white/25 hover:bg-[#20222B] cursor-pointer ${opacity}`}
    >
      {icon}
    </div>
  );
};

/* --- App mockups --- */

/* --- Stack SVGs & Icons --- */

function GoogleDriveIcon() {
  return (
    <svg viewBox="0 0 87.3 78" className="w-6 h-6">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H0c0 1.5.4 3 1.2 4.3z" fill="#0066da" />
      <path d="M43.65 25 29.8 1H15.95c-1.4 0-2.8.4-4.1 1.2L0 25h43.65z" fill="#00ac47" />
      <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 8.95-15.5c.8-1.4 1.2-2.8 1.2-4.25H44.85l12.35 21.3c1.3.8 2.7 1.2 4.1 1.2z" fill="#ea4335" />
      <path d="M43.65 25 57.5 1H43.65l-14.5 24h14.5z" fill="#00832d" />
      <path d="m59.8 55.5-16.15-28-13.85 24h43.85l-13.85 4z" fill="#2684fc" />
      <path d="M73.4 26.5 60.55 4.2C59.35 2.1 57.5 1 55.4 1H43.65L57.5 25l15.9 1.5z" fill="#ffba00" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <rect x="2" y="4" width="14" height="16" rx="2" fill="#5059C9" />
      <circle cx="18" cy="8" r="3" fill="#7B83EB" />
      <path d="M15 13C15 11.9 15.9 11 17 11H19C20.1 11 21 11.9 21 13V18H15V13Z" fill="#7B83EB" />
      <path d="M7 9H11V11H10V16H8V11H7V9Z" fill="white" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#4285F4" d="M1.5 5.5v13a2 2 0 0 0 2 2h2V9.8L1.5 5.5z"/>
      <path fill="#34A853" d="M18.5 20.5h2a2 2 0 0 0 2-2v-13l-4 4.3v10.7z"/>
      <path fill="#EA4335" d="M18.5 5.5L12 11.5 5.5 5.5A2 2 0 0 0 3.5 7v2.8l8.5 7.7 8.5-7.7V7a2 2 0 0 0-2-1.5z"/>
      <path fill="#FBBC04" d="M18.5 3.5H5.5C4.4 3.5 3.5 4.4 3.5 5.5l8.5 7.7 8.5-7.7c0-1.1-.9-2-2-2z"/>
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path d="M13.2 2.5L3 14.8h8.5L9.6 22.5 21 8.8h-8.8l1-6.3z" fill="#3ECF8E" />
    </svg>
  );
}

function ShopifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#95BF47">
      <path d="M17.5 6.3L15.3 4c-.3-.3-.8-.5-1.3-.5h-.4C13.4 2 12.3 1 10.9 1 9.4 1 8.2 2.2 8 3.7c-.5.1-.9.4-1.2.8L4.3 7c-.5.6-.7 1.3-.6 2.1l1.5 12.3c.1.9.8 1.6 1.7 1.6h10.2c.9 0 1.6-.7 1.7-1.6l1.5-12.3c.1-.8-.1-1.6-.6-2.1l-.8-.7zM10.9 2.5c.7 0 1.3.5 1.4 1.2h-2.8c.1-.7.7-1.2 1.4-1.2zm-2.8 5.7l1.7-1.9h2.4l1.7 1.9H8.1z"/>
    </svg>
  );
}

function FirebaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#FFA000" d="M3.8 18.2L7.5 4.5c.1-.4.6-.5.9-.2l4.1 7.2L3.8 18.2z"/>
      <path fill="#F57C00" d="M16.5 8.1l-2.6-4.9c-.2-.4-.8-.4-1 0L3.8 18.2l12.7-10.1z"/>
      <path fill="#FFCA28" d="M12.5 11.5l2.4-4.5c.2-.4.8-.4 1 0l4.3 11.2-7.7-6.7z"/>
    </svg>
  );
}

function GoogleCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#4285F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM12 17l-4-4h2.5v-3h3v3H16l-4 4z"/>
    </svg>
  );
}

function StripeIcon() {
  return (
    <span className="font-bold text-white/90 text-sm tracking-tighter">stripe</span>
  );
}

function NotionIcon() {
  return (
    <div className="w-6 h-6 rounded bg-white text-black font-bold flex items-center justify-center text-xs">
      N
    </div>
  );
}

function DatabricksIcon() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-4 h-1 rounded-xs bg-[#FF3621]" />
      <div className="w-5 h-1 rounded-xs bg-[#FF3621]" />
      <div className="w-6 h-1 rounded-xs bg-[#FF3621]" />
      <span className="text-[8px] text-white/60 tracking-tight font-medium mt-0.5">databricks</span>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/80">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
    </svg>
  );
}

function SalesforceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#00A1E0" className="w-6 h-6">
      <path d="M17.8 8.4C17.2 5.3 14.5 3 11.2 3 8.8 3 6.6 4.3 5.5 6.3 2.4 6.8 0 9.4 0 12.6 0 16.1 2.9 19 6.4 19h11.2c3.5 0 6.4-2.9 6.4-6.4 0-2.8-1.8-5.2-4.4-6.1l-.8-.1-.2-.8z"/>
    </svg>
  );
}

function HubSpotIcon() {
  return (
    <div className="text-[9px] text-[#FF7A59] font-bold tracking-tight">HubSpot</div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#229ED9" className="w-5 h-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z"/>
    </svg>
  );
}

function LinearIcon() {
  return (
    <div className="w-5 h-5 rounded-full border-2 border-[#5E6AD2] border-t-transparent animate-spin-slow flex items-center justify-center">
      <div className="w-1.5 h-1.5 bg-[#5E6AD2] rounded-full" />
    </div>
  );
}

function ArcIcon() {
  return (
    <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-white/40" />
    </div>
  );
}

function TwitchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#9146FF" className="w-5 h-5">
      <path d="M2.149 0l-1.612 4.196v16.055h5.331v3.749h3.753l3.749-3.749h4.825l5.805-5.807v-14.444h-21.851zm19.708 13.371l-3.212 3.214h-5.894l-3.75 3.749v-3.749h-4.823v-14.446h17.679v11.232z"/>
    </svg>
  );
}

function GitLabIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#FC6D26" className="w-5 h-5">
      <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0l-2.664 8.189H7.582L4.918 1.263c-.136-.423-.731-.423-.867 0L1.387 9.452.045 13.587c-.121.375.014.787.331 1.017l11.624 8.445 11.624-8.445c.317-.23.452-.642.331-1.017z"/>
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 opacity-70">
      <path d="M12 1L24 22H0L12 1Z" />
    </svg>
  );
}

function PostgresIcon() {
  return (
    <div className="w-5 h-5 rounded-full border border-[#336791] text-[#336791] font-bold text-[9px] flex items-center justify-center">
      PG
    </div>
  );
}

function OpenAIIcon() {
  return (
    <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
      <div className="w-2 h-2 rounded-xs bg-white/40" />
    </div>
  );
}

function PauseIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1 h-4 bg-white/40 rounded-full" />
      <div className="w-1 h-4 bg-white/40 rounded-full" />
    </div>
  );
}
