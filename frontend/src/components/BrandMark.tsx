interface BrandMarkProps {
  size?: number
  className?: string
}

/**
 * Travel Sites mark: a silver globe with an orange orbit swoosh and a plane.
 * Fixed palette (navy / silver / orange) so it reads the same on any surface;
 * `color` overrides on the parent no longer tint it.
 */
export function BrandMark({ size = 48, className = 'brand-mark' }: BrandMarkProps = {}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Travel Sites"
    >
      <circle cx="21" cy="22" r="14" fill="#123b5e" />
      <g stroke="#c3cdd8" strokeWidth="1.5">
        <circle cx="21" cy="22" r="14" />
        <ellipse cx="21" cy="22" rx="5.6" ry="14" />
        <path d="M7 22h28M9.5 14.5h23M9.5 29.5h23" strokeWidth="1.2" />
      </g>
      <path
        d="M5 29c7 8 22 9.5 33 1.5"
        stroke="#e8912d"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M31 8.5l9-2.5-2.4 8.9-4.2 2.1 1 4.7-3.1-3-4.1 1.6 2.9-3.7z"
        fill="#c3cdd8"
      />
    </svg>
  )
}
