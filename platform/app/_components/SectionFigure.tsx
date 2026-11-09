// A wide illustration inside a section that already carries its own heading and
// copy. The section says what it says in words; the picture is decoration, so it
// carries no alt text a screen reader would read twice.
export function SectionFigure({
  src,
  width = 1600,
  height = 1000,
  className = "",
}: {
  src: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden border border-border ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}