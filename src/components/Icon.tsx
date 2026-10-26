import type { ReactNode } from "react"

export type IconName = "arrow" | "book" | "calendar" | "cards" | "check" | "chevron" | "close" | "cloud" | "home" | "menu" | "quiz" | "spark" | "target"

export default function Icon({
  name,

  size = 20,
}: {
  name: IconName

  size?: number
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,

    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),

    cards: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="3" />
        <path d="M9 8h6M9 12h4M3.5 7.5 2.4 17a3 3 0 0 0 2.65 3.33" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    chevron: <path d="m9 18 6-6-6-6" />,

    close: <path d="m6 6 12 12M18 6 6 18" />,

    cloud: (
      <path d="M17.5 19H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.1 9.6 4.7 4.7 0 0 1 17.5 19Z" />
    ),

    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),

    menu: <path d="M4 7h16M4 12h16M4 17h16" />,

    quiz: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M8 8h.01M11 8h5M8 12h.01M11 12h5M8 16h.01M11 16h5" />
      </>
    ),

    spark: (
      <path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {paths[name]}
      </g>
    </svg>
  )
}
