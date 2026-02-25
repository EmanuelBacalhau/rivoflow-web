import { Loader2Icon } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
};

export function LoadingSpinner({ text, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2">
      <Loader2Icon className={`${sizeClasses[size]} animate-spin`} />
      {text && <span>{text}</span>}
    </div>
  );
}
