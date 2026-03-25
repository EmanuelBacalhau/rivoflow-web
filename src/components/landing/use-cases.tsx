import {
  LayoutGridIcon,
  PlayCircleIcon,
  ShoppingBagIcon,
  VideoIcon,
} from "lucide-react";

export function LandingUseCases() {
  const useCases = [
    { icon: LayoutGridIcon, label: "Social Media", color: "text-pink-500" },
    { icon: ShoppingBagIcon, label: "E-commerce", color: "text-amber-500" },
    { icon: PlayCircleIcon, label: "YouTube & Ads", color: "text-red-500" },
    { icon: VideoIcon, label: "Apresentações", color: "text-blue-500" },
  ];

  return (
    <section className="py-14 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
          Ideal para qualquer tipo de campanha
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {useCases.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
