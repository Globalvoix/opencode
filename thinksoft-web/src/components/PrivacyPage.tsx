import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
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
        <span className="hidden sm:inline">Last updated: September 26, 2026</span>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto my-auto py-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#141414]">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6 text-sm sm:text-[15px] text-neutral-700 leading-relaxed">
          <p>
            This Privacy Policy explains how Thinksoft ("we", "our", or "us") handles information when you visit
            thinksoft.dev or use the Thinksoft desktop application (collectively, the "Service"). If you have any
            questions, contact us at info@thinksoft.dev.
          </p>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">No accounts, no tracking profiles</h2>
            <p className="mt-2">
              The Thinksoft desktop app requires no account and no sign-in. We do not create user profiles, we do not
              run advertising, and we do not sell personal information to anyone.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Your API keys stay on your device</h2>
            <p className="mt-2">
              Thinksoft connects to AI providers with API keys you supply yourself. Those keys are stored locally on
              your own machine and are used only to send your requests to the provider you chose. They are never sent
              to Thinksoft, and we have no way to read them. You are responsible for keeping your keys safe and for
              complying with the terms of whichever AI provider you use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Your code stays yours</h2>
            <p className="mt-2">
              The agent runs against the project on your own machine. We do not collect, view, or store the contents
              of your files. When you use a third-party AI provider, your prompts may be processed by that provider
              under their own privacy policy and terms — Thinksoft is not responsible for their practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">What the website records</h2>
            <p className="mt-2">
              thinksoft.dev is a static site hosted on Vercel. Like any web server, the host keeps routine technical
              logs (such as IP addresses and requested pages) to operate reliably and resist abuse. We do not combine
              these logs with anything that identifies you, because there is nothing to combine them with.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Emails you send us</h2>
            <p className="mt-2">
              If you write to info@thinksoft.dev — for support, partnerships, or anything else — we keep your message
              only as long as needed to answer it. Creator-network applications are reviewed by our team and kept only
              for as long as the program runs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Legal requests</h2>
            <p className="mt-2">
              We may disclose information if required by law or legal process, or where reasonably necessary to
              protect Thinksoft, our users, or others.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy from time to time and will revise the "Last updated" date above. Continued use
              of the Service after a change takes effect means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Contact</h2>
            <p className="mt-2">
              Questions about this policy or your information: info@thinksoft.dev.
            </p>
          </section>
        </div>
      </main>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
};
