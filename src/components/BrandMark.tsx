import { Link } from "react-router-dom";

export function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-block">
      <img
        src="/branding/logo-30-col.png"
        alt="Ireland — Mozambique · 30 Years"
        className={compact ? "h-12 w-auto max-w-[220px] object-contain" : "h-24 w-auto max-w-[min(90vw,420px)] object-contain"}
      />
    </Link>
  );
}

/** Mantido para compatibilidade — o fundo «30» vem do IrlandaPageShell. */
export function HarpWatermark() {
  return null;
}