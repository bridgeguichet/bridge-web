export function ZigzagPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="zigzag" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M0 15 L7.5 0 L15 15 L22.5 0 L30 15 L22.5 30 L15 15 L7.5 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zigzag)" />
    </svg>
  );
}
