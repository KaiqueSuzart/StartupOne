"use client";

import { useRef, useState } from "react";

/**
 * O input de arquivo nativo mostra "Choose File / No file chosen" no idioma
 * do NAVEGADOR, não da página — não há como traduzir. A saída é escondê-lo e
 * dirigir o clique a partir de um botão nosso.
 */
export function PhotoField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        Foto do odômetro
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
          >
            <path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
          {fileName === null ? "Escolher foto" : "Trocar foto"}
        </button>
        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            fileName === null ? "text-slate-400" : "text-slate-700"
          }`}
        >
          {fileName ?? "Nenhuma foto selecionada"}
        </span>
      </div>
      <input
        ref={inputRef}
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        required
        onChange={(event) =>
          setFileName(event.target.files?.[0]?.name ?? null)
        }
        className="sr-only"
      />
      <span className="mt-1 block text-xs text-slate-500">
        Fica privada: o relatório público mostra apenas o hash da imagem.
      </span>
    </div>
  );
}
