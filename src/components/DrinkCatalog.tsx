import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Wine, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import {
  DRINK_CATEGORIES,
  DRINK_CATEGORY_LABEL,
  type DrinkCategory,
} from "@/lib/drink-categories";
import { fetchDrinksCatalog, mediaUrl, submitDrinkOrderOpen, type Drink } from "@/lib/api";

function DrinkCard({ drink, onSelect }: { drink: Drink; onSelect: () => void }) {
  const out = drink.quantity <= 0;
  const img = drink.image_url ? mediaUrl(drink.image_url) : null;

  return (
    <button
      type="button"
      disabled={out}
      onClick={onSelect}
      className={`irlanda-card overflow-hidden rounded-2xl text-left transition ${
        out ? "opacity-45" : "hover:border-[#169b62]/45"
      }`}
    >
      <div className="relative aspect-square w-full bg-[#f0ebe0]">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#007168]/45">
            <Wine className="h-14 w-14" strokeWidth={1.2} />
          </div>
        )}
        {out && (
          <span className="absolute inset-x-0 bottom-0 bg-white/90 py-1 text-center text-xs text-[#5c5c5c]">
            Esgotado
          </span>
        )}
      </div>
      <p className="px-3 py-3 text-center text-sm font-semibold text-[#1c1c1c]">{drink.name}</p>
    </button>
  );
}

function CategoryPicker({ onSelect }: { onSelect: (c: DrinkCategory) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DRINK_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className="irlanda-card rounded-2xl px-5 py-7 text-center transition hover:border-[#169b62]/45"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9a9a9a]">{cat}</p>
          <p className="font-display text-brand-title mt-2 text-xl">{DRINK_CATEGORY_LABEL[cat]}</p>
        </button>
      ))}
    </div>
  );
}

export function DrinkCatalog() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<DrinkCategory | null>(null);

  const drinksQuery = useQuery({
    queryKey: ["drinks-catalog", category],
    queryFn: () => fetchDrinksCatalog(category!),
    enabled: !!category,
    refetchInterval: 8000,
  });

  const [selected, setSelected] = useState<Drink | null>(null);
  const [qty, setQty] = useState(1);
  const [mesa, setMesa] = useState("");
  const [step, setStep] = useState<"qty" | "mesa">("qty");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const drinks = drinksQuery.data ?? [];
  const maxQty = selected ? Math.min(10, selected.quantity) : 1;

  const closeModal = () => {
    setSelected(null);
    setQty(1);
    setMesa("");
    setStep("qty");
    setErr("");
  };

  const confirmQty = () => {
    if (qty < 1) return;
    setStep("mesa");
    setErr("");
  };

  const order = async () => {
    if (!selected || qty < 1) return;
    const table = mesa.trim();
    if (!table) {
      setErr("Indique o número da mesa.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await submitDrinkOrderOpen(selected.id, qty, table);
      setDone(true);
      closeModal();
      await qc.invalidateQueries({ queryKey: ["drinks-catalog", category] });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao enviar pedido.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 pb-12 pt-6">
      <header className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <BrandMark compact />
        </div>
        <h1 className="font-display text-brand-title text-4xl">Bar</h1>
        <p className="mt-2 text-sm text-[#5c5c5c]">
          {category ? DRINK_CATEGORY_LABEL[category] : "Escolha a categoria."}
        </p>
      </header>

      {!category && <CategoryPicker onSelect={setCategory} />}

      {category && (
        <>
          <button
            type="button"
            onClick={() => {
              setCategory(null);
              setDone(false);
            }}
            className="irlanda-card mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-brand-accent"
          >
            <ArrowLeft size={16} /> Categorias
          </button>

          {done && (
            <p className="irlanda-card mb-6 rounded-2xl border-[#169b62]/40 p-4 text-center text-sm text-[#169b62]">
              Pedido enviado! O garçom irá entregar na sua mesa.
            </p>
          )}

          {drinksQuery.isError && (
            <p className="irlanda-card mb-4 rounded-2xl p-4 text-center text-sm text-[#d21034]">
              {drinksQuery.error instanceof Error
                ? drinksQuery.error.message
                : "Não foi possível carregar o catálogo."}
            </p>
          )}

          {drinksQuery.isLoading && <p className="mb-4 text-center text-sm text-[#5c5c5c]">A carregar bebidas…</p>}

          {!drinksQuery.isLoading && !drinksQuery.isError && !drinks.length && (
            <p className="irlanda-card rounded-2xl p-8 text-center text-[#5c5c5c]">Sem bebidas nesta categoria.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {drinks.map((d) => (
              <DrinkCard
                key={d.id}
                drink={d}
                onSelect={() => {
                  if (d.quantity <= 0) return;
                  setSelected(d);
                  setQty(1);
                  setMesa("");
                  setStep("qty");
                  setErr("");
                  setDone(false);
                }}
              />
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1c1c1c]/25 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="irlanda-card relative w-full max-w-sm rounded-3xl p-5 text-center">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1 text-[#5c5c5c]"
              onClick={closeModal}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-[#1c1c1c]">{selected.name}</h2>

            {step === "qty" ? (
              <>
                <p className="mb-2 mt-6 text-sm font-medium text-[#5c5c5c]">Quantidade</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#007168]/25 bg-white text-lg"
                    disabled={qty <= 1}
                    onClick={() => setQty((n) => Math.max(1, n - 1))}
                  >
                    −
                  </button>
                  <span className="min-w-8 text-xl font-semibold tabular-nums text-[#1c1c1c]">{qty}</span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#007168]/25 bg-white text-lg"
                    disabled={qty >= maxQty}
                    onClick={() => setQty((n) => Math.min(maxQty, n + 1))}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="btn-brand mt-5 w-full rounded-full py-3" onClick={confirmQty}>
                  Continuar
                </button>
              </>
            ) : (
              <>
                <p className="mb-2 mt-6 text-sm text-[#5c5c5c]">
                  Quantidade: <strong className="text-[#1c1c1c]">{qty}</strong>
                </p>
                <label className="block text-left">
                  <span className="mb-1 block text-xs text-[#5c5c5c]">Número da mesa</span>
                  <input
                    value={mesa}
                    onChange={(e) => setMesa(e.target.value)}
                    className="w-full rounded-2xl border border-[#007168]/25 bg-white px-4 py-3 text-center text-lg font-semibold text-[#1c1c1c] focus:border-[#169b62]/45 focus:outline-none"
                    placeholder="Ex: 12"
                    inputMode="text"
                    autoFocus
                  />
                </label>
                {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="irlanda-card flex-1 rounded-full py-3 text-sm"
                    onClick={() => setStep("qty")}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className="btn-brand flex-[2] rounded-full py-3 disabled:opacity-50"
                    disabled={busy}
                    onClick={order}
                  >
                    {busy ? "A enviar…" : "Confirmar pedido"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}