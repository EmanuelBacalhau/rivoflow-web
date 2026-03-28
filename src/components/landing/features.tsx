import { Card, CardContent } from "@/components/ui/card";
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
    <section id="features" className="relative py-28">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      {/* Subtle glow */}
      <div className="glow-orb w-96 h-96 bg-purple-600/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Produto"
          title={
            <>
              Tudo que você precisa para{" "}
              <span className="text-gradient-primary">produção visual</span>
            </>
          }
          subtitle="Uma única interface para criar, configurar e exportar seus criativos com inteligência artificial."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feat) => (
            <Card
              key={feat.id}
              className={`${feat.wide ? "md:col-span-2" : "md:col-span-1"} card-glow bg-white/3 backdrop-blur-sm border-white/8 hover:border-purple-500/25 transition-all duration-300 py-0 shadow-none`}
            >
              <CardContent className="p-7">
                <div
                  className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-5`}
                >
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
