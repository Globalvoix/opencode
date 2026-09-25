import React from 'react';

// Model providers, not customers. The six marks below are the official brand paths
// from Simple Icons (CC0); the names are providers the desktop app ships support for
// in packages/core/src/plugin/provider. The rest are called out in the copy.
const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    color: '#141414',
    size: 'h-7 sm:h-9',
    d: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    color: '#0D0D0D',
    size: 'h-8 sm:h-10',
    d: 'M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    color: '#4E6EF2',
    size: 'h-8 sm:h-10',
    d: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81',
  },
  {
    id: 'meta',
    name: 'Meta',
    color: '#0866FF',
    size: 'h-8 sm:h-10',
    d: 'M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    color: '#76B900',
    size: 'h-7 sm:h-9',
    d: 'M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    color: '#0D0D0D',
    size: 'h-7 sm:h-9',
    d: 'M18.654 3.87a5.087 5.087 0 110 10.174L23.7 19.09c.64.641.187 1.737-.72 1.737H8.48a8.479 8.479 0 010-16.958h10.175zM8.479 7.26a5.087 5.087 0 100 10.176 5.087 5.087 0 000-10.175z',
  },
]

export const TrustedBrandsSection: React.FC<{ onLearnMore?: () => void }> = ({ onLearnMore }) => {
  return (
    <section className="w-full bg-white pt-2 sm:pt-4 pb-16 sm:pb-20 border-b border-gray-200/60 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">

          {/* Left 3 Logo Columns with vertical dividing borders */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 border-y sm:border-y-0 sm:border-l sm:border-r border-gray-200/80">
            {[PROVIDERS.slice(0, 2), PROVIDERS.slice(2, 4), PROVIDERS.slice(4, 6)].map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col justify-center divide-y divide-gray-200/80">
                {column.map((provider) => (
                  <div
                    key={provider.id}
                    className="h-32 sm:h-36 flex items-center justify-center px-6 group hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill={provider.color}
                        role="img"
                        aria-label={provider.name}
                        className={`${provider.size} w-auto shrink-0 group-hover:scale-105 transition-transform duration-200`}
                      >
                        <path d={provider.d} />
                      </svg>
                      <span className="text-[15px] sm:text-[17px] font-semibold tracking-tight text-[#141414] whitespace-nowrap">
                        {provider.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Column: Title, Description & Action Button */}
          <div className="lg:col-span-4 lg:pl-12 flex flex-col items-start justify-center">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#141414] leading-snug">
              Every model, one agent
            </h2>
            <p className="mt-3.5 text-sm sm:text-[15px] text-[#4B5563] leading-relaxed max-w-md font-normal">
              Thinksoft ships with 28 providers built in. Anthropic, OpenAI, Gemini, xAI and Meta work on day one, alongside Copilot, OpenRouter,
              Bedrock, Azure and NVIDIA. Anything OpenAI-compatible works too. The catalogue behind them reaches more than 75, including models
              you run locally on Ollama or LM Studio.
            </p>
            <div className="mt-6">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-gray-50 text-[#141414] text-xs sm:text-[13px] font-medium rounded-lg border border-gray-200 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                Try Thinksoft
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
