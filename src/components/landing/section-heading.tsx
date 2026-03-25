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
      <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-4">
        {label}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
