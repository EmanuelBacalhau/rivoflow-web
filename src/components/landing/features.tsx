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
              Acelere toda sua{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                produção visual
              </span>
            </>
          }
          subtitle="Tudo que você precisa em uma única interface inteligente. Crie melhor, em menos tempo e pague apenas pelo que usar."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`${feat.wide ? "md:col-span-2" : "md:col-span-1"} p-7 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all group`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
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
