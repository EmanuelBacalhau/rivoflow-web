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
              Quem usa,{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                recomenda
              </span>
            </>
          }
          subtitle=""
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col gap-4"
            >
              <span className="text-5xl font-serif leading-none text-indigo-500/25 select-none">
                "
              </span>
              <p className="text-sm text-foreground leading-relaxed flex-1 -mt-3">
                {t.quote}
              </p>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }, (_, i) => (
                    <StarIcon
                      key={`star-${t.name}-${i}`}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
