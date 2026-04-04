"use client";

import { ChevronDownIcon } from "lucide-react";
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
    <section className="relative py-28" aria-labelledby="faq-heading">
      <div className="section-glow-divider" aria-hidden="true" />
      <div
        className="absolute inset-0 dot-pattern opacity-10"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8">
        <SectionHeading
          label="Dúvidas"
          title="Perguntas frequentes"
          id="faq-heading"
        />

        <dl className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border bg-white/2 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-purple-500/30 shadow-sm shadow-purple-500/10"
                    : "border-white/8 hover:border-white/12"
                }`}
              >
                <dt>
                  <button
                    id={buttonId}
                    type="button"
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-sm font-semibold pr-4 text-white">
                      {faq.question}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 text-purple-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </dt>
                <dd
                  id={panelId}
                  className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                  hidden={!isOpen}
                >
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
