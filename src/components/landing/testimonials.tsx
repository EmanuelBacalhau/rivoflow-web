import { StarIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
}

interface LandingTestimonialsProps {
  testimonials: Testimonial[];
}

export function LandingTestimonials({
  testimonials,
}: LandingTestimonialsProps) {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Depoimentos"
          title={
            <>
              Quem usa, <span className="text-primary">recomenda</span>
            </>
          }
          subtitle=""
        />

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-border bg-card flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }, (_, i) => (
                  <StarIcon
                    key={`star-${t.name}-${i}`}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                "{t.quote}"
              </p>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
