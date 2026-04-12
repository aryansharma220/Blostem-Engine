const iconPaths = {
  spark: (
    <path d="M12 2l2.6 6.8L21 11.5l-6.4 2.2L12 20l-2.6-6.3L3 11.5l6.4-2.7L12 2z" />
  ),
  stack: (
    <>
      <path d="M12 3l8 4-8 4-8-4 8-4z" />
      <path d="M4 11l8 4 8-4" />
      <path d="M4 15l8 4 8-4" />
    </>
  ),
  compare: (
    <>
      <path d="M7 6h10" />
      <path d="M7 18h10" />
      <path d="M7 6l-4 4 4 4" />
      <path d="M17 18l4-4-4-4" />
    </>
  ),
  trend: (
    <>
      <path d="M4 17l6-6 4 4 6-8" />
      <path d="M16 7h4v4" />
    </>
  ),
  shield: (
    <path d="M12 3l7 3v6c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V6l7-3z" />
  ),
  download: (
    <>
      <path d="M12 3v10" />
      <path d="M8 10l4 4 4-4" />
      <path d="M4 19h16" />
    </>
  ),
};

export function Icon({ name, className = "", strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}
