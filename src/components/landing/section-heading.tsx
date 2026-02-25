interface SectionHeadingProps {
  label: string;
  title: React.ReactNode;
  subtitle: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">
        {label}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-lg mx-auto">{subtitle}</p>
    </div>
  );
}
