import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  disabled: boolean;
}

interface LandingPricingProps {
  plans: PricingPlan[];
}

export function LandingPricing({ plans }: LandingPricingProps) {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Preços"
          title="Pague apenas pelo uso"
          subtitle="Abandone assinaturas. Faça um depósito e use seus créditos no seu ritmo."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border ${
                plan.highlight
                  ? "border-indigo-500 bg-card shadow-2xl shadow-indigo-500/10 relative"
                  : "border-border/50 bg-card/50"
              } ${plan.disabled ? "opacity-60 pointer-events-none" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded-full">
                  Mais popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-indigo-500/20" : plan.disabled ? "bg-muted-foreground/20" : "bg-green-500/20"}`}
                    >
                      <CheckIcon
                        className={`w-2.5 h-2.5 ${plan.highlight ? "text-primary" : plan.disabled ? "text-muted-foreground" : "text-green-600"}`}
                      />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/auth/google" className="block">
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                      : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
