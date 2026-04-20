export function SunburstPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="sunburst" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
          <g transform="translate(50, 50)">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-200"
                  stroke="currentColor"
                  strokeWidth={i % 2 === 0 ? "2" : "1"}
                  opacity={i % 2 === 0 ? "0.15" : "0.08"}
                  transform={`rotate(${angle})`}
                />
              );
            })}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sunburst)" />
    </svg>
  );
}
