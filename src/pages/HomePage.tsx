import { Link } from "react-router-dom";
import { MessageCircleHeart, Wine } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const tiles = [
  {
    to: "/catalogo",
    title: "Bar",
    desc: "Catálogo de bebidas para convidados",
    icon: Wine,
    accent: "border-l-[#169b62]",
  },
  {
    to: "/felicitacoes/enviar",
    title: "Felicitações",
    desc: "Enviar mensagem para a tela",
    icon: MessageCircleHeart,
    accent: "border-l-[#f4c430]",
  },
] as const;

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
        <BrandMark />
        <p className="mt-6 max-w-md text-center text-sm text-[#5c5c5c]">
          Ireland — Mozambique · 30 Years of Diplomatic Relations
          <br />
          <span className="text-[#7a7a7a]">Bar · Felicitações</span>
        </p>

        <div className="mt-12 w-full space-y-4">
          {tiles.map(({ to, title, desc, icon: Icon, accent }) => (
            <Link
              key={to}
              to={to}
              className={`irlanda-card flex items-center gap-4 rounded-2xl border-l-4 px-6 py-5 transition hover:border-[#169b62]/50 ${accent}`}
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8f5f0] text-[#169b62]">
                <Icon size={22} />
              </div>
              <div className="text-left">
                <p className="font-display text-2xl text-[#1c1c1c]">{title}</p>
                <p className="text-sm text-[#5c5c5c]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

    </main>
  );
}