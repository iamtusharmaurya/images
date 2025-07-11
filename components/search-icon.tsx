export function CustomSearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="10" cy="10" r="8" fill="#4A5568" stroke="#2D3748" strokeWidth="1" />

      {/* Inner lens */}
      <circle cx="10" cy="10" r="6.5" fill="#BEE3F8" />

      {/* Highlight reflections */}
      <ellipse cx="8" cy="7" rx="1.5" ry="0.8" fill="white" opacity="0.8" transform="rotate(-30 8 7)" />
      <ellipse cx="7" cy="12" rx="0.8" ry="2" fill="white" opacity="0.6" transform="rotate(-20 7 12)" />

      {/* Handle */}
      <rect x="16" y="16" width="2.5" height="6" rx="1.25" fill="#FBB040" transform="rotate(45 16 16)" />
      <rect x="15.5" y="15.5" width="1.5" height="5" rx="0.75" fill="#F6931E" transform="rotate(45 15.5 15.5)" />

      {/* Handle connection */}
      <circle cx="15.5" cy="15.5" r="1.2" fill="#4A5568" />
    </svg>
  )
}
