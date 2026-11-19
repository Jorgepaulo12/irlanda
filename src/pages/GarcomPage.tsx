import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Armchair, Check, Clock, PackageCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  fetchStaffDrinkOrders,
  updateDrinkOrderStatus,
  type DrinkOrder,
  type DrinkOrderStatus,
} from "@/lib/api";
import { BrandMark } from "@/components/BrandMark";

const STATUS_LABEL: Record<DrinkOrderStatus, string> = {
  pending: "Pendente",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const FILTER_TABS: { id: "pending" | "all" | DrinkOrderStatus; label: string }[] = [
  { id: "pending", label: "Pendentes" },
  { id: "delivered", label: "Entregues" },
  { id: "all", label: "Todos" },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: DrinkOrderStatus) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (status === "pending") return `${base} bg-[#f4c430]/35 text-[#5c4a00]`;
  if (status === "delivered") return `${base} bg-[#e8f5f0] text-[#169b62]`;
  return `${base} bg-[#f0f0f0] text-[#5c5c5c]`;
}

export function GarcomPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "all" | DrinkOrderStatus>("pending");
  const [busyId, setBusyId] = useState<number | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["staff-drink-orders", filter],
    queryFn: () =>
      filter === "all" ? fetchStaffDrinkOrders() : fetchStaffDrinkOrders(filter === "pending" ? "pending" : filter),
    refetchInterval: 3000,
  });

  const orders = ordersQuery.data ?? [];

  const pendingCount = useMemo(() => {
    if (filter === "pending") return orders.length;
    return orders.filter((o) => o.status === "pending").length;
  }, [filter, orders]);

  const setStatus = async (order: DrinkOrder, status: DrinkOrderStatus) => {
    setBusyId(order.id);
    try {
      await updateDrinkOrderStatus(order.id, status);
      await qc.invalidateQueries({ queryKey: ["staff-drink-orders"] });
      await qc.invalidateQueries({ queryKey: ["drinks-catalog"] });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-8 pb-20">
      <BrandMark compact />
      <header className="mb-6 mt-4">
        <p className="text-xs uppercase tracking-widest text-[#7a7a7a]">Staff</p>
        <h1 className="font-display text-3xl text-brand-title">Pedidos — Garçom</h1>
        <p className="mt-1 text-sm text-[#5c5c5c]">
          {pendingCount} pendente{pendingCount === 1 ? "" : "s"} nesta vista
        </p>
        <Link to="/" className="link-muted mt-3 inline-block text-sm">
          ← Início
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === tab.id ? "btn-brand shadow-sm" : "irlanda-card text-[#5c5c5c]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ordersQuery.isLoading && <p className="text-[#5c5c5c]">A carregar pedidos…</p>}

      {ordersQuery.isError && (
        <p className="irlanda-card rounded-2xl p-4 text-sm text-[#d21034]">
          Não foi possível carregar os pedidos. Verifique a ligação à API.
        </p>
      )}

      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="irlanda-card rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold text-[#1c1c1c]">{o.drink_name}</p>
                <p className="text-sm text-[#5c5c5c]">
                  {o.guest_name}
                  {o.guest_table && (
                    <span className="ml-1 inline-flex items-center gap-1 font-medium text-[#1c1c1c]">
                      <Armchair className="inline" size={14} />
                      {o.guest_table}
                    </span>
                  )}{" "}
                  · <span className="tabular-nums font-medium text-[#1c1c1c]">×{o.quantity}</span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#7a7a7a]">
                  <Clock size={12} /> {formatTime(o.created_at)}
                </p>
              </div>
              <span className={statusBadge(o.status)}>{STATUS_LABEL[o.status]}</span>
            </div>

            {o.status === "pending" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === o.id}
                  onClick={() => setStatus(o, "delivered")}
                  className="btn-brand inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  <PackageCheck size={16} /> Marcar entregue
                </button>
                <button
                  type="button"
                  disabled={busyId === o.id}
                  onClick={() => setStatus(o, "cancelled")}
                  className="irlanda-card inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm text-[#d21034] disabled:opacity-50"
                >
                  <XCircle size={16} /> Cancelar
                </button>
              </div>
            )}

            {o.status === "delivered" && o.delivered_at && (
              <p className="mt-2 flex items-center gap-1 text-xs text-[#169b62]">
                <Check size={12} /> Entregue às {formatTime(o.delivered_at)}
              </p>
            )}
          </li>
        ))}
      </ul>

      {!ordersQuery.isLoading && !orders.length && (
        <p className="irlanda-card rounded-2xl p-8 text-center text-[#5c5c5c]">Nenhum pedido nesta lista.</p>
      )}
    </main>
  );
}