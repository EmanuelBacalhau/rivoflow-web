import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
      <SearchIcon className="size-3 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sidebar-foreground placeholder:text-muted-foreground outline-none"
      />
    </div>
  );
}
