import { QuoteIcon, StarIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="relative py-28">
      <div className="section-glow-divider" />
      <div className="absolute inset-0 dot-pattern opacity-15" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8">
        <SectionHeading
          label="Depoimentos"
          title={
            <>
              Quem usa, <span className="text-gradient-primary">recomenda</span>
            </>
          }
        />

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => {
            const initials = t.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <Card
                key={t.name}
                className="card-glow bg-white/3 backdrop-blur-sm border-white/8 hover:border-purple-500/25 transition-all duration-300 py-0 shadow-none"
              >
                <CardContent className="p-7 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }, (_, i) => (
                        <StarIcon
                          key={`star-${t.name}-${i}`}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <QuoteIcon className="w-5 h-5 text-purple-500/20" />
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed flex-1">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px] font-semibold bg-purple-500/15 text-purple-300">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
