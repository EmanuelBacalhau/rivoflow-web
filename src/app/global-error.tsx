"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-950 text-white flex items-center justify-center antialiased">
        <div className="text-center px-6">
          <p className="text-7xl md:text-8xl font-bold text-red-500/20 leading-none mb-4 select-none">
            Erro
          </p>
          <h1 className="text-xl font-semibold mb-2">Algo deu muito errado</h1>
          <p className="text-sm text-neutral-400 mb-8 max-w-sm mx-auto">
            Ocorreu um erro crítico. Tente recarregar a página.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
