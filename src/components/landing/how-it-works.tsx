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
    <section id="how-it-works" className="py-24 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Como funciona"
          title="Do zero ao criativo em minutos"
          subtitle="Três passos simples. Sem curva de aprendizado."
        />

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-border" />

          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>
              <h3 className="font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-xs">
                {step.description}
              </p>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {step.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
