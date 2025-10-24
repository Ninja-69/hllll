export function CupIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h12v7a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z" />
      <path d="M6 4H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2" />
      <path d="M18 4h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
    </svg>
  )
}
