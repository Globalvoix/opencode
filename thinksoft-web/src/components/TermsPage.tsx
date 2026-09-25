import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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
          Terms of Service
        </h1>

        <div className="mt-8 space-y-6 text-sm sm:text-[15px] text-neutral-700 leading-relaxed">
          <p>
            These Terms of Service ("Terms") govern your use of the Thinksoft website and the Thinksoft desktop
            application (collectively, the "Service"). By downloading, installing, or using Thinksoft, you agree to
            these Terms. If you do not agree, do not use the Service. Questions: info@thinksoft.dev.
          </p>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">What Thinksoft is</h2>
            <p className="mt-2">
              Thinksoft is a desktop application that runs on your own machine and connects to third-party AI providers
              using API keys you supply yourself. There are no accounts, no subscriptions managed by us, and no
              server-side processing of your work on our systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Acceptable use</h2>
            <p className="mt-2">
              You may use Thinksoft only in compliance with these Terms and all applicable laws. You agree not to use
              the Service to create or distribute malware, phishing tools, or other malicious software; to gain
              unauthorized access to any system; to infringe the intellectual property or rights of others; or to
              misrepresent Thinksoft or its output as the work of someone else.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Your keys and your providers</h2>
            <p className="mt-2">
              You supply your own API keys, and your use of each AI provider is governed by that provider's own terms
              and pricing. You are responsible for keeping your keys secret, for all usage billed to them, and for
              complying with each provider's terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">AI-generated output</h2>
            <p className="mt-2">
              Artificial intelligence can produce inaccurate, incomplete, or insecure output. You are solely responsible
              for reviewing, testing, and validating anything Thinksoft generates before using it in production or
              relying on it for any purpose. Thinksoft does not guarantee that generated content is correct, secure,
              unique, or fit for your use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Ownership</h2>
            <p className="mt-2">
              You own the code and content you create with Thinksoft, subject to applicable law and any third-party
              license obligations (for example, open-source licenses on dependencies the generated code uses). Because
              your work never passes through our systems, you grant us no license over it — there is nothing for a
              license to cover. Thinksoft and its branding, logos, and software remain ours; you may not use our
              trademarks without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Availability</h2>
            <p className="mt-2">
              We may update, change, or discontinue the Service or any of its features at any time. We do not guarantee
              uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Disclaimers</h2>
            <p className="mt-2">
              The Service is provided "as is" and "as available" to the fullest extent permitted by law. We disclaim
              all warranties, express or implied, including merchantability, fitness for a particular purpose,
              non-infringement, availability, accuracy, and security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Limitation of liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, Thinksoft and its owner are not liable for indirect, incidental,
              consequential, special, or punitive damages, including loss of profits, revenue, data, or goodwill. Our
              total aggregate liability, if any, will not exceed the amount you paid to Thinksoft in the twelve months
              before the claim arose — which, for a free download with your own API keys, may be nothing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Termination</h2>
            <p className="mt-2">
              You may stop using Thinksoft at any time by uninstalling it. Since there are no accounts, there is
              nothing to close and nothing held on our side to delete.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Privacy</h2>
            <p className="mt-2">
              Your use of the Service is also governed by our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Changes to these Terms</h2>
            <p className="mt-2">
              We may revise these Terms from time to time and will update the date above. Continued use after a change
              takes effect means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">Contact</h2>
            <p className="mt-2">
              Questions about these Terms: info@thinksoft.dev.
            </p>
          </section>
        </div>
      </main>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
};
