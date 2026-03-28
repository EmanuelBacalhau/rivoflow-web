import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <Badge
        variant="outline"
        className="mb-5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary border-primary/20 bg-primary/5"
      >
        {label}
      </Badge>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-5">
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
