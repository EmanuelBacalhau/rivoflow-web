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
    <section className="py-24">
      <div className="max-w-2xl mx-auto px-6">
        <SectionHeading
          label="Dúvidas"
          title="Perguntas frequentes"
          subtitle=""
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border bg-card overflow-hidden transition-colors ${
                  isOpen ? "border-primary/30" : "border-border"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span className="text-sm font-semibold pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
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
