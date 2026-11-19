import { type ReactNode, useEffect, useRef, useState } from "react";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { TelaScreenBackdrop } from "@/components/TelaScreenBackdrop";
import { type FelicitacaoPhase, useFelicitacoesTela } from "@/hooks/useFelicitacoesTela";
import { useTelaRealtime } from "@/hooks/useTelaRealtime";
import { fetchRecentFelicitacoes, fetchScreenState, type ScreenMode } from "@/lib/api";
import type { ScreenStatePayload } from "@/lib/screen-ws";

const SPARKS = ["✨", "☘", "💛", "⭐"];

function FelicitacaoCard({
  guest_name,
  message,
  phase,
}: {
  guest_name: string;
  message: string;
  phase: FelicitacaoPhase;
}) {
  const cardClass =
    phase === "leave"
      ? "felic-card-out"
      : phase === "enter"
        ? "felic-card-in"
        : phase === "show"
          ? "felic-card-show"
          : "";
  const msgClass = phase === "show" || phase === "enter" ? "felic-msg-in" : "";

  return (
    <article
      className={`relative z-20 max-w-[82%] rounded-2xl border border-[#169b62]/35 bg-white/92 px-12 py-10 text-center shadow-lg ring-1 ring-[#007168]/15 backdrop-blur-md ${cardClass}`}
    >
      <Sparkles className="felic-icon-in mx-auto mb-4 text-[#f4c430]" size={36} />
      <MessageCircleHeart className="felic-icon-in mx-auto mb-6 text-[#169b62]" size={44} />
      <p
        key={message}
        className={`font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-snug text-[#1c1c1c] ${msgClass}`}
      >
        &ldquo;{message}&rdquo;
      </p>
      <p className="felic-sub-in text-brand-accent mt-6 text-lg">— {guest_name}</p>
    </article>
  );
}

function FelicitacaoBackdrop({ phase }: { phase: FelicitacaoPhase }) {
  if (phase === "hidden") return null;
  const cls = phase === "leave" ? "felic-backdrop-out" : phase === "enter" ? "felic-backdrop-in" : "opacity-100";
  return <div className={`absolute inset-0 z-[15] bg-white/35 backdrop-blur-[2px] ${cls}`} aria-hidden />;
}

function FelicitacaoStage({ phase, children }: { phase: FelicitacaoPhase; children: ReactNode }) {
  if (phase === "hidden") return null;
  const wrapClass =
    phase === "leave"
      ? "felic-stage-out"
      : phase === "enter"
        ? "felic-stage-in"
        : "felic-stage-show";
  return (
    <div
      className={`relative z-20 flex w-full max-w-5xl items-center justify-center px-16 ${wrapClass}`}
      aria-live="polite"
    >
      {children}
    </div>
  );
}

function Stage({
  pool,
  initialState,
}: {
  pool: { id: number; guest_name: string; message: string }[];
  initialState: ScreenStatePayload | null;
}) {
  const { display, phase, enqueue } = useFelicitacoesTela(pool);
  const enqueueRef = useRef(enqueue);
  enqueueRef.current = enqueue;
  const { screenState, wsLive } = useTelaRealtime(initialState, (t) => enqueueRef.current(t));

  const mode: ScreenMode = screenState?.mode ?? "live";
  const liveSlides = screenState?.live_slides ?? [];

  return (
    <div className="grid min-h-screen place-items-center">
      <div
        className="relative overflow-hidden rounded-2xl border border-[#169b62]/20 bg-[#faf8f4] text-[#1c1c1c] shadow-xl"
        style={{ width: 1920, height: 1080 }}
      >
        <TelaScreenBackdrop mode={mode} liveSlides={liveSlides} activeMedia={screenState?.active_media ?? null} />

        <header className="absolute left-12 top-10 z-10">
          <img src="/branding/logo-30-col.png" alt="" className="h-16 w-auto object-contain" />
          <p className="mt-3 text-xs uppercase tracking-[0.4em] text-[#5c5c5c]">Felicitações</p>
        </header>

        <div className="absolute right-12 top-10 z-10 flex items-center gap-2 rounded-full border border-[#007168]/25 bg-white/85 px-5 py-2 shadow-sm">
          <span className={`h-2 w-2 rounded-full ${wsLive ? "bg-[#169b62]" : "bg-[#f4c430]"}`} />
          <span className="text-xs uppercase tracking-[0.3em] text-[#5c5c5c]">
            {wsLive ? "Tempo real" : "Sincronização"}
          </span>
        </div>

        <main className="absolute inset-0 z-10 grid place-items-center">
          {display && phase !== "hidden" ? (
            <>
              <FelicitacaoBackdrop phase={phase} />
              <FelicitacaoStage phase={phase}>
                <FelicitacaoCard guest_name={display.guest_name} message={display.message} phase={phase} />
              </FelicitacaoStage>
            </>
          ) : null}
        </main>

        <style>{`
          @keyframes felic-backdrop-in {
            from { opacity: 0; backdrop-filter: blur(0); }
            to { opacity: 1; backdrop-filter: blur(2px); }
          }
          @keyframes felic-backdrop-out {
            from { opacity: 1; }
            to { opacity: 0; backdrop-filter: blur(0); }
          }
          @keyframes felic-stage-in {
            0% { opacity: 0; transform: scale(0.88) translateY(56px); }
            65% { opacity: 1; transform: scale(1.03) translateY(-6px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes felic-stage-out {
            0% { opacity: 1; transform: scale(1) translateX(0); filter: blur(0); }
            100% { opacity: 0; transform: scale(0.86) translateX(12%) translateY(-40px); filter: blur(8px); }
          }
          @keyframes felic-card-in {
            0% { opacity: 0; box-shadow: 0 0 0 rgb(22 155 98 / 0); }
            100% { opacity: 1; box-shadow: 0 24px 48px rgb(0 0 0 / 0.12); }
          }
          @keyframes felic-card-out {
            0% { opacity: 1; transform: rotate(0deg); }
            100% { opacity: 0; transform: rotate(-1.5deg) scale(0.96); }
          }
          @keyframes felic-msg-in {
            0% { opacity: 0; transform: translateY(28px) scale(0.96); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes felic-icon-in {
            0% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
            100% { opacity: 1; transform: scale(1) rotate(0); }
          }
          @keyframes felic-sub-in {
            from { opacity: 0; transform: translateY(14px); letter-spacing: 0.2em; }
            to { opacity: 1; transform: translateY(0); letter-spacing: normal; }
          }
          .felic-backdrop-in { animation: felic-backdrop-in 0.5s ease-out forwards; }
          .felic-backdrop-out { animation: felic-backdrop-out 0.72s ease-in forwards; }
          .felic-stage-in { animation: felic-stage-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          .felic-stage-out { animation: felic-stage-out 0.72s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .felic-stage-show { opacity: 1; transform: none; }
          .felic-card-in { animation: felic-card-in 0.55s ease-out 0.08s both; }
          .felic-card-out { animation: felic-card-out 0.65s ease-in forwards; }
          .felic-card-show { opacity: 1; }
          .felic-msg-in { animation: felic-msg-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
          .felic-icon-in { animation: felic-icon-in 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
          .felic-sub-in { animation: felic-sub-in 0.5s ease-out 0.35s both; }
        `}</style>
      </div>
    </div>
  );
}

export function FelicitacoesPage() {
  const [boot, setBoot] = useState<{
    pool: { id: number; guest_name: string; message: string }[];
    state: ScreenStatePayload | null;
  } | null>(null);

  useEffect(() => {
    document.body.classList.add("felicitacoes-projecao");
    return () => document.body.classList.remove("felicitacoes-projecao");
  }, []);

  useEffect(() => {
    Promise.all([fetchScreenState(), fetchRecentFelicitacoes(40)])
      .then(([state, pool]) =>
        setBoot({
          state: {
            mode: state.mode,
            active_media: state.active_media,
            live_slides: state.live_slides ?? [],
          },
          pool,
        }),
      )
      .catch(() => setBoot({ state: null, pool: [] }));
  }, []);

  if (!boot) {
    return <p className="grid min-h-screen place-items-center text-[#5c5c5c]">A preparar a tela…</p>;
  }

  return <Stage pool={boot.pool} initialState={boot.state} />;
}