/**
 * Junta classes ignorando valores falsy.
 * Nao faz merge de conflito Tailwind de proposito: os componentes
 * base expoem variantes fechadas, entao nao ha classe competindo.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
