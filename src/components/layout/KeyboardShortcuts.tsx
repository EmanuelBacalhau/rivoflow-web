function Key({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono text-[10px] text-gray-600 leading-none">
      {label}
    </span>
  );
}

export function KeyboardShortcuts() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow border border-gray-200/80 text-[11px] text-gray-500 select-none pointer-events-none">
      <span className="flex items-center gap-1.5">
        <Key label="P" /> Prompt
      </span>
      <span className="w-px h-3 bg-gray-300" />
      <span className="flex items-center gap-1.5">
        <Key label="I" /> Imagem
      </span>
      <span className="w-px h-3 bg-gray-300" />
      <span className="flex items-center gap-1.5">
        <Key label="G" /> Gerador
      </span>
      <span className="w-px h-3 bg-gray-300" />
      <span className="flex items-center gap-1.5">
        <Key label="⌫" /> Remover
      </span>
    </div>
  );
}
