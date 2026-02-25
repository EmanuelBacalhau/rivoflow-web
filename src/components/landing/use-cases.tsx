import {
  LayoutGridIcon,
  PlayCircleIcon,
  ShoppingBagIcon,
  VideoIcon,
} from "lucide-react";

export function LandingUseCases() {
  const useCases = [
    {
      icon: LayoutGridIcon,
      label: "Social Media",
      color: "text-pink-500",
      bg: "bg-pink-500/8",
    },
    {
      icon: ShoppingBagIcon,
      label: "E-commerce",
      color: "text-amber-500",
      bg: "bg-amber-500/8",
    },
    {
      icon: PlayCircleIcon,
      label: "YouTube & Ads",
      color: "text-red-500",
      bg: "bg-red-500/8",
    },
    {
      icon: VideoIcon,
      label: "Apresentações",
      color: "text-blue-500",
      bg: "bg-blue-500/8",
    },
  ];

  return (
    <section className="py-14 border-y border-border/50 bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
          Ideal para qualquer tipo de campanha
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {useCases.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-border/60 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
