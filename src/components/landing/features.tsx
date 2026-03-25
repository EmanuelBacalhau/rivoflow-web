import { SectionHeading } from "./section-heading";

interface Feature {
  id: string;
  title: string;
  description: string;
  wide: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

interface LandingFeaturesProps {
  features: Feature[];
}

export function LandingFeatures({ features }: LandingFeaturesProps) {
  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Produto"
          title={
            <>
              Tudo que você precisa para{" "}
              <span className="text-primary">produção visual</span>
            </>
          }
          subtitle="Uma única interface para criar, configurar e exportar seus criativos com inteligência artificial."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`${feat.wide ? "md:col-span-2" : "md:col-span-1"} p-7 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-5`}
              >
                <feat.icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <h3 className="font-semibold text-base mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
