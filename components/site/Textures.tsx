/**
 * Fixed texture layers behind the content: the twelve-column hairline grid
 * (bone) and the dot grid (carbon). Their opacity is a tone role, so they fade
 * in and out with the chapters. Static sections paint over them.
 */
export function Textures() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 print:hidden">
      <div className="mx-auto hidden h-full w-full max-w-[1200px] px-8 md:block md:px-16">
        <div
          className="h-full w-full"
          style={{
            opacity: "var(--grid-opacity)",
            backgroundImage:
              "repeating-linear-gradient(to right, var(--ink-rule) 0 1px, transparent 1px calc(100% / 12))",
          }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          opacity: "calc(var(--dots-opacity) * 0.45)",
          backgroundImage: "radial-gradient(var(--ink-faint) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
