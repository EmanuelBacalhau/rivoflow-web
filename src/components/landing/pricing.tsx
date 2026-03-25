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
    <section id="pricing" className="py-24 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Preços"
          title="Pague apenas pelo uso"
          subtitle="Sem assinaturas. Deposite créditos e use no seu ritmo."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl ${
                plan.highlight
                  ? "bg-background border-2 border-primary shadow-lg"
                  : "bg-background border border-border"
              } ${plan.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
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
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckIcon
                      className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/google" className="block">
                <Button
                  className="w-full h-11"
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
