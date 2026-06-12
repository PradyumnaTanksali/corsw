export function ColumnGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden md:block print:hidden"
    >
      <div className="mx-auto h-full w-full max-w-[1200px] px-8 md:px-16">
        <div
          className="h-full w-full"
          style={{
            opacity: 0.04,
            backgroundImage:
              "repeating-linear-gradient(to right, var(--ink) 0 1px, transparent 1px calc(100% / 12))",
          }}
        />
      </div>
    </div>
  );
}
