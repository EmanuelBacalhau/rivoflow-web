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
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Como funciona"
          title={
            <>
              Do zero ao criativo em{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                poucos minutos
              </span>
            </>
          }
          subtitle="Sem curva de aprendizado. Sem fricção. Só resultado."
        />

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-8 left-[calc(33.33%+8px)] right-[calc(33.33%+8px)] h-px bg-linear-to-r from-indigo-300/40 via-indigo-400/60 to-indigo-300/40" />

          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-indigo-500" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>
              <h3 className="font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {step.description}
              </p>
              <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                {step.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
