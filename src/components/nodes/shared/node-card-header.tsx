import { CheckIcon, Trash2Icon } from "lucide-react";
import { CardHeader } from "@/components/ui/card";

interface NodeCardHeaderProps {
  color: "amber" | "blue" | "purple" | "green";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  isExecuted?: boolean;
  onRemove?: () => void;
}

const colorSchemes = {
  amber: {
    bg: "bg-linear-to-r from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
    icon: "bg-linear-to-br from-amber-400 to-amber-600",
    text: "text-amber-500",
    hover: "text-amber-500/50 hover:text-red-500",
  },
  blue: {
    bg: "bg-linear-to-r from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20",
    icon: "bg-linear-to-br from-blue-400 to-blue-600",
    text: "text-blue-500",
    hover: "text-blue-500/50 hover:text-red-500",
  },
  purple: {
    bg: "bg-linear-to-r from-purple-500/10 to-indigo-500/10",
    border: "border-purple-500/20",
    icon: "bg-linear-to-br from-purple-400 to-purple-600",
    text: "text-purple-500",
    hover: "text-purple-500/50 hover:text-red-500",
  },
  green: {
    bg: "bg-linear-to-r from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    icon: "bg-linear-to-br from-green-400 to-green-600",
    text: "text-green-500",
    hover: "text-green-500/50 hover:text-red-500",
  },
};

export function NodeCardHeader({
  color,
  icon: Icon,
  title,
  subtitle,
  isExecuted = false,
  onRemove,
}: NodeCardHeaderProps) {
  const scheme = colorSchemes[color];

  return (
    <CardHeader
      className={`flex flex-row items-center gap-2.5 px-3 py-2.5! ${scheme.bg} border-b ${scheme.border} space-y-0`}
    >
      <div
        className={`w-7 h-7 rounded-lg ${scheme.icon} flex items-center justify-center shadow-sm shrink-0`}
      >
        <Icon className="size-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-card-foreground leading-tight">
          {title}
        </h3>
        <p className={`text-[10px] ${scheme.text}`}>{subtitle}</p>
      </div>
      {isExecuted && (
        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <CheckIcon className="size-3 text-green-600" />
        </div>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className={`${scheme.hover} transition-colors shrink-0 nodrag cursor-pointer md:hidden`}
          type="button"
          aria-label="Remover nó"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      )}
    </CardHeader>
  );
}
