import type { ReactNode } from "react";

/** Conteúdo acima do fundo global (definido no `body` em styles.css). */
export function IrlandaPageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`irlanda-page-inner ${className}`}>{children}</div>;
}