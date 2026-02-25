interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  message: string;
}

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <Icon className="size-6 text-muted-foreground" />
      {title && (
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      )}
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}
