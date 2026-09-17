import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="3.75" fill="#0B0C0F" />
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="2.875" fill="none" stroke="white" stroke-width="0.625" />
      <path d="M5.9375 5.46875L8.4375 8L5.9375 10.5312" fill="none" stroke="white" stroke-width="1.3125" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="9.21875" y="9.84375" width="2.875" height="0.875" rx="0.4375" fill="white" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="120" fill="#0B0C0F" />
      <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="white" stroke-width="20" />
      <path d="M190 175 L270 256 L190 337" fill="none" stroke="white" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="295" y="315" width="92" height="28" rx="14" fill="white" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <rect width="512" height="512" rx="120" fill="#0B0C0F" />
      <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="white" stroke-width="20" />
      <path d="M190 175 L270 256 L190 337" fill="none" stroke="white" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="295" y="315" width="92" height="28" rx="14" fill="white" />
    </svg>
  )
}
