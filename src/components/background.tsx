export function Background() {
  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-b from-primary/3 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
