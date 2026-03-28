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
    <section className="relative py-28">
      <div className="section-glow-divider" />
      <div className="absolute inset-0 dot-pattern opacity-10" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8">
        <SectionHeading label="Dúvidas" title="Perguntas frequentes" />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border bg-white/2 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-purple-500/30 shadow-sm shadow-purple-500/10"
                    : "border-white/8 hover:border-white/12"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span className="text-sm font-semibold pr-4 text-white">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 text-purple-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
