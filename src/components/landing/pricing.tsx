import { ArrowRightIcon, CheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <section
      id="pricing"
      className="relative py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="section-glow-divider" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-purple-600/3 to-transparent"
        aria-hidden="true"
      />
      <div
        className="glow-orb w-80 h-80 bg-purple-600/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8">
        <SectionHeading
          label="Preços"
          title="Pague apenas pelo uso"
          subtitle="Sem assinaturas. Deposite créditos e use no seu ritmo."
          id="pricing-heading"
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative py-0 overflow-visible shadow-none ${
                plan.highlight
                  ? "card-glow border-purple-500/30 shadow-lg shadow-purple-500/10 bg-purple-500/4"
                  : "border-white/8 bg-white/2"
              } ${plan.disabled ? "opacity-50 pointer-events-none" : ""} backdrop-blur-sm`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs shadow-lg shadow-primary/30">
                  <SparklesIcon className="w-3 h-3" aria-hidden="true" />
                  Mais popular
                </Badge>
              )}

              <CardHeader className="pt-8 pb-0">
                <CardTitle className="font-display text-lg text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-4 pb-0">
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-display text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm mb-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                <Separator className="mb-6 bg-white/8" />

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <CheckIcon
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-purple-400" : "text-muted-foreground"}`}
                      />
                      <span className="leading-relaxed text-white/70">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6 pb-8">
                <Link href="/auth/google" className="block w-full">
                  <Button
                    className={`w-full h-11 rounded-xl ${plan.highlight ? "shadow-lg shadow-primary/25" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
