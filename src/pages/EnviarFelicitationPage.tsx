import { Link } from "react-router-dom";
import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { sendFelicitationOpen } from "@/lib/api";
import { FELICITATION_NAME_MAX } from "@/lib/felicitation-limits";

export function EnviarFelicitationPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName || !trimmedMsg) {
      setErr("Preencha o nome e a mensagem.");
      return;
    }
    if (trimmedName.length > FELICITATION_NAME_MAX) {
      setErr(`O nome tem no máximo ${FELICITATION_NAME_MAX} caracteres.`);
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await sendFelicitationOpen(trimmedName, trimmedMsg);
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao enviar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="link-muted mb-6 text-sm">
          ← Início
        </Link>
        <div className="irlanda-card rounded-3xl p-8">
          <div className="mb-4 flex justify-center">
            <BrandMark compact />
          </div>
          <div className="mb-2 flex justify-center text-[#169b62]">
            <MessageCircleHeart size={36} strokeWidth={1.4} />
          </div>
          <h1 className="font-display text-brand-title text-center text-3xl">Felicitações</h1>
          <p className="mt-2 text-center text-sm text-[#5c5c5c]">A sua mensagem será mostrada na sala.</p>

          {done ? (
            <p className="mt-6 rounded-2xl border border-[#169b62]/30 bg-[#e8f5f0] p-5 text-center text-sm text-[#169b62]">
              Enviado com sucesso. Obrigado!
            </p>
          ) : (
            <form onSubmit={send} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-[#5c5c5c]">
                  O seu nome (máx. {FELICITATION_NAME_MAX} caracteres)
                </span>
                <input
                  value={name}
                  maxLength={FELICITATION_NAME_MAX}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-[#007168]/25 bg-white px-4 py-3 text-[#1c1c1c] focus:border-[#169b62]/45 focus:outline-none"
                  placeholder="Nome"
                  required
                />
                <span className="mt-0.5 block text-right text-xs text-[#9a9a9a] tabular-nums">
                  {name.length}/{FELICITATION_NAME_MAX}
                </span>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-[#5c5c5c]">Mensagem</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full resize-y rounded-2xl border border-[#007168]/25 bg-white px-4 py-3 text-[#1c1c1c] focus:border-[#169b62]/45 focus:outline-none"
                  placeholder="Escreva a sua felicitação…"
                  required
                />
              </label>
              {err && <p className="text-center text-sm text-red-600">{err}</p>}
              <button type="submit" disabled={busy} className="btn-brand w-full rounded-full py-3 disabled:opacity-50">
                {busy ? "A enviar…" : "Enviar para a tela"}
              </button>
            </form>
          )}
        </div>
    </main>
  );
}
