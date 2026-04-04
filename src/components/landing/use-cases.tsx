import {
  LayoutGridIcon,
  PlayCircleIcon,
  ShoppingBagIcon,
  VideoIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function LandingUseCases() {
  const useCases = [
    { icon: LayoutGridIcon, label: "Social Media", color: "text-pink-400" },
    { icon: ShoppingBagIcon, label: "E-commerce", color: "text-amber-400" },
    { icon: PlayCircleIcon, label: "YouTube & Ads", color: "text-red-400" },
    { icon: VideoIcon, label: "Apresentações", color: "text-blue-400" },
  ];

  return (
    <section className="relative py-14" aria-labelledby="use-cases-heading">
      <div className="section-glow-divider mb-14" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6">
        <h2
          id="use-cases-heading"
          className="text-center text-xs text-muted-foreground/50 uppercase tracking-[0.2em] mb-8"
        >
          Ideal para qualquer tipo de campanha
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {useCases.map((item) => (
            <li key={item.label}>
              <Badge
                variant="outline"
                className="px-5 py-2.5 text-sm font-medium border-white/8 bg-white/3 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-300"
              >
                <item.icon
                  className={`w-4 h-4 ${item.color} shrink-0`}
                  aria-hidden="true"
                />
                {item.label}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="section-glow-divider mt-14" aria-hidden="true" />
    </section>
  );
}
