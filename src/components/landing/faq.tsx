"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "./section-heading";

interface FAQ {
  question: string;
  answer: string;
}

interface LandingFaqProps {
  faqs: FAQ[];
}

export function LandingFaq({ faqs }: LandingFaqProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-2xl mx-auto px-6">
        <SectionHeading
          label="Dúvidas"
          title="Perguntas frequentes"
          subtitle=""
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border/50 bg-card/50 overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="text-sm font-semibold pr-4">
                  {faq.question}
                </span>
                {openFaq === idx ? (
                  <MinusIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <PlusIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
