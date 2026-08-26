export function BrandMark() {
  return (
    <svg
      className="brand-mark"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three stacked signal lines: live / hold / disconnected */}
      <circle cx="24" cy="12" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="36" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
