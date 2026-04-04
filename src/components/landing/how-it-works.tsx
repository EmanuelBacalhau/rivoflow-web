import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  time: string;
}

interface LandingHowItWorksProps {
  steps: Step[];
}

export function LandingHowItWorks({ steps }: LandingHowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className="relative py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="section-glow-divider" aria-hidden="true" />
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-purple-600/3 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8">
        <SectionHeading
          label="Como funciona"
          title="Do zero ao criativo em minutos"
          subtitle="Três passos simples. Sem curva de aprendizado."
          id="how-it-works-heading"
        />

        <div className="relative">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-14 left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px bg-linear-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
            aria-hidden="true"
          />

          <ol className="grid md:grid-cols-3 gap-6 list-none p-0">
            {steps.map((step, idx) => (
              <li key={step.title}>
                <Card className="bg-white/3 backdrop-blur-sm border-white/8 hover:border-purple-500/25 transition-all duration-300 py-0 shadow-none h-full">
                  <CardContent className="flex flex-col items-center text-center p-8">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/8 border border-purple-500/15 flex items-center justify-center">
                        <step.icon
                          className="w-7 h-7 text-purple-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Badge
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 text-[10px] font-bold flex items-center justify-center shadow-lg shadow-primary/30"
                        aria-hidden="true"
                      >
                        {idx + 1}
                      </Badge>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium text-purple-300 border-purple-500/20 bg-purple-500/8"
                    >
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
