import { createUniqueId, type ComponentProps } from "solid-js"

export function WordmarkV2(props: Pick<ComponentProps<"svg">, "class">) {
  const mask = createUniqueId()
  const maskGradient = createUniqueId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 129"
      fill="none"
      role="img"
      aria-label="Thinksoft"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g opacity="0.6">
        <g mask={`url(#${mask})`}>
          <g opacity="0.16">
            <g opacity="0.7" fill="currentColor">
              <rect x="16" y="19" width="65" height="13" />
              <rect x="42" y="32" width="13" height="13" />
              <rect x="42" y="45" width="13" height="13" />
              <rect x="42" y="58" width="13" height="13" />
              <rect x="42" y="71" width="13" height="13" />
              <rect x="42" y="84" width="13" height="13" />
              <rect x="42" y="97" width="13" height="13" />
              <rect x="94" y="19" width="13" height="13" />
              <rect x="146" y="19" width="13" height="13" />
              <rect x="94" y="32" width="13" height="13" />
              <rect x="146" y="32" width="13" height="13" />
              <rect x="94" y="45" width="13" height="13" />
              <rect x="146" y="45" width="13" height="13" />
              <rect x="94" y="58" width="65" height="13" />
              <rect x="94" y="71" width="13" height="13" />
              <rect x="146" y="71" width="13" height="13" />
              <rect x="94" y="84" width="13" height="13" />
              <rect x="146" y="84" width="13" height="13" />
              <rect x="94" y="97" width="13" height="13" />
              <rect x="146" y="97" width="13" height="13" />
              <rect x="172" y="19" width="65" height="13" />
              <rect x="198" y="32" width="13" height="13" />
              <rect x="198" y="45" width="13" height="13" />
              <rect x="198" y="58" width="13" height="13" />
              <rect x="198" y="71" width="13" height="13" />
              <rect x="198" y="84" width="13" height="13" />
              <rect x="172" y="97" width="65" height="13" />
              <rect x="250" y="19" width="13" height="13" />
              <rect x="302" y="19" width="13" height="13" />
              <rect x="250" y="32" width="26" height="13" />
              <rect x="302" y="32" width="13" height="13" />
              <rect x="250" y="45" width="13" height="13" />
              <rect x="276" y="45" width="13" height="13" />
              <rect x="302" y="45" width="13" height="13" />
              <rect x="250" y="58" width="13" height="13" />
              <rect x="276" y="58" width="13" height="13" />
              <rect x="302" y="58" width="13" height="13" />
              <rect x="250" y="71" width="13" height="13" />
              <rect x="289" y="71" width="26" height="13" />
              <rect x="250" y="84" width="13" height="13" />
              <rect x="289" y="84" width="26" height="13" />
              <rect x="250" y="97" width="13" height="13" />
              <rect x="302" y="97" width="13" height="13" />
              <rect x="328" y="19" width="13" height="13" />
              <rect x="380" y="19" width="13" height="13" />
              <rect x="328" y="32" width="13" height="13" />
              <rect x="367" y="32" width="13" height="13" />
              <rect x="328" y="45" width="13" height="13" />
              <rect x="354" y="45" width="13" height="13" />
              <rect x="328" y="58" width="26" height="13" />
              <rect x="328" y="71" width="13" height="13" />
              <rect x="354" y="71" width="13" height="13" />
              <rect x="328" y="84" width="13" height="13" />
              <rect x="367" y="84" width="13" height="13" />
              <rect x="328" y="97" width="13" height="13" />
              <rect x="380" y="97" width="13" height="13" />
              <rect x="419" y="19" width="52" height="13" />
              <rect x="406" y="32" width="13" height="13" />
              <rect x="406" y="45" width="13" height="13" />
              <rect x="419" y="58" width="39" height="13" />
              <rect x="458" y="71" width="13" height="13" />
              <rect x="458" y="84" width="13" height="13" />
              <rect x="406" y="97" width="52" height="13" />
              <rect x="497" y="19" width="39" height="13" />
              <rect x="484" y="32" width="13" height="13" />
              <rect x="536" y="32" width="13" height="13" />
              <rect x="484" y="45" width="13" height="13" />
              <rect x="536" y="45" width="13" height="13" />
              <rect x="484" y="58" width="13" height="13" />
              <rect x="536" y="58" width="13" height="13" />
              <rect x="484" y="71" width="13" height="13" />
              <rect x="536" y="71" width="13" height="13" />
              <rect x="484" y="84" width="13" height="13" />
              <rect x="536" y="84" width="13" height="13" />
              <rect x="497" y="97" width="39" height="13" />
              <rect x="562" y="19" width="65" height="13" />
              <rect x="562" y="32" width="13" height="13" />
              <rect x="562" y="45" width="13" height="13" />
              <rect x="562" y="58" width="52" height="13" />
              <rect x="562" y="71" width="13" height="13" />
              <rect x="562" y="84" width="13" height="13" />
              <rect x="562" y="97" width="13" height="13" />
              <rect x="640" y="19" width="65" height="13" />
              <rect x="666" y="32" width="13" height="13" />
              <rect x="666" y="45" width="13" height="13" />
              <rect x="666" y="58" width="13" height="13" />
              <rect x="666" y="71" width="13" height="13" />
              <rect x="666" y="84" width="13" height="13" />
              <rect x="666" y="97" width="13" height="13" />
            </g>
          </g>
        </g>
      </g>
      <defs>
        <mask id={mask} style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="129">
          <rect width="720" height="129" fill={`url(#${maskGradient})`} />
        </mask>
        <linearGradient id={maskGradient} x1="360" y1="68" x2="360" y2="129" gradientUnits="userSpaceOnUse">
          <stop stop-color="white" stop-opacity="0.7" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
