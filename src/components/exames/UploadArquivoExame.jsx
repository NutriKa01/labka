"use client";

import { useId, useRef, useState } from "react";
import { UploadSimple, FileText, X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

const ACEITA = ".pdf,.jpg,.jpeg,.png,.heic,.heif";

function formatarTamanho(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Componente controlado: só avisa o pai quando um arquivo é
 * selecionado/removido, sem lógica de rede.
 */
export default function UploadArquivoExame({ arquivo, onArquivoSelecionado, disabled = false }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [arrastando, setArrastando] = useState(false);

  function selecionarArquivo(file) {
    if (!file) return;
    onArquivoSelecionado(file);
  }

  function aoSoltar(evento) {
    evento.preventDefault();
    setArrastando(false);
    if (disabled) return;
    selecionarArquivo(evento.dataTransfer.files?.[0]);
  }

  if (arquivo) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 h-11 px-3.5",
          "rounded-[var(--radius-control)] bg-surface border border-line"
        )}
      >
        <FileText size={18} className="text-dim shrink-0" aria-hidden="true" />
        <span className="flex-1 min-w-0 truncate text-sm text-ink">{arquivo.name}</span>
        <span className="text-xs text-dim shrink-0">{formatarTamanho(arquivo.size)}</span>
        <button
          type="button"
          onClick={() => onArquivoSelecionado(null)}
          disabled={disabled}
          className="text-dim hover:text-ink transition-colors disabled:opacity-50"
          aria-label="Remover arquivo"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={aoSoltar}
      className={cn(
        "flex items-center gap-2.5 h-11 px-3.5 cursor-pointer",
        "rounded-[var(--radius-control)] bg-surface",
        "border border-dashed transition-colors duration-150",
        disabled && "opacity-50 cursor-not-allowed",
        arrastando ? "border-accent" : "border-line hover:border-line-strong"
      )}
    >
      <UploadSimple size={16} className="text-dim shrink-0" aria-hidden="true" />
      <span className="text-sm text-dim">
        Arraste o laudo aqui ou clique pra selecionar (PDF, JPG, PNG ou HEIC)
      </span>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACEITA}
        disabled={disabled}
        onChange={(e) => selecionarArquivo(e.target.files?.[0])}
        className="sr-only"
      />
    </label>
  );
}
