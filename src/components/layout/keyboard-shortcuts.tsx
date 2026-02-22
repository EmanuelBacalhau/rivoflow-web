import { Card, CardContent } from "../ui/card";

function Key({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center px-2 py-2 rounded bg-muted font-mono text-[10px] leading-none">
      {label}
    </span>
  );
}

export function KeyboardShortcuts() {
  return (
    <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-xl shadow text-[11px] select-none pointer-events-none">
      <CardContent className="flex items-center gap-4 p-0">
        <span className="flex items-center gap-1.5">
          <Key label="P" /> Prompt
        </span>

        <span className="w-px h-3 bg-white" />

        <span className="flex items-center gap-1.5">
          <Key label="I" /> Imagem
        </span>

        <span className="w-px h-3 bg-white" />

        <span className="flex items-center gap-1.5">
          <Key label="G" /> Gerador
        </span>

        <span className="w-px h-3 bg-white" />

        <span className="flex items-center gap-1.5">
          <Key label="⌫" /> Remover
        </span>
      </CardContent>
    </Card>
  );
}
