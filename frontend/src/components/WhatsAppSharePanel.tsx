"use client";

import { useState } from "react";

type ShareLink = {
  name: string;
  url: string;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.75.46 3.45 1.32 4.95L2 22l5.31-1.39a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.45 17.5 2 12.04 2Zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.15.82.84-3.07-.2-.32a8.2 8.2 0 0 1-1.26-4.38c0-4.53 3.69-8.21 8.24-8.21 4.54 0 8.24 3.68 8.24 8.21 0 4.54-3.7 8.28-8.22 8.28Zm4.52-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.59.69 2.01.75 2.73.63.42-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function WhatsAppSharePanel({
  catalogUrl,
  industries,
}: {
  catalogUrl: string;
  industries: ShareLink[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const fullMessage = [
    "Mustafá Representações — catálogo por indústria",
    catalogUrl,
    "",
    ...industries.map((item) => `${item.name}: ${item.url}`),
  ].join("\n");

  async function copy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copie o texto:", text);
    }
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <details className="surface mt-14 rounded-[var(--radius)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-[var(--ink)] [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <WhatsAppIcon />
          Copiar links para enviar no WhatsApp
        </span>
        <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--ink-mute)] uppercase">
          Mustafá
        </span>
      </summary>
      <div className="border-t border-[var(--line)] px-5 py-5">
        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
          Cole no WhatsApp. A pessoa cai nesta vitrine e escolhe a indústria.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => copy("catalogo", catalogUrl)}
          >
            {copied === "catalogo" ? "Link copiado" : "Copiar link da vitrine"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => copy("texto", fullMessage)}
          >
            {copied === "texto" ? "Texto copiado" : "Copiar texto com todas as marcas"}
          </button>
        </div>
        <ul className="mt-5 grid gap-2">
          {industries.map((item) => (
            <li
              key={item.url}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-3 first:border-t-0 first:pt-0"
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--ink)]">{item.name}</p>
                <p className="truncate font-mono text-[0.72rem] text-[var(--ink-mute)]">
                  {item.url}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary min-h-9 px-3 text-[0.68rem]"
                onClick={() => copy(item.url, `${item.name}: ${item.url}`)}
              >
                {copied === item.url ? "Copiado" : "Copiar"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
