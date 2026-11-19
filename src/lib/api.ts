import type { DrinkCategory } from "@/lib/drink-categories";
import { apiUrl } from "@/lib/api-base";

export type Drink = {
  id: number;
  name: string;
  category: DrinkCategory;
  quantity: number;
  active: boolean;
  sort_order: number;
  image_url?: string | null;
};

export type DrinkOrderStatus = "pending" | "delivered" | "cancelled";

export type DrinkOrder = {
  id: number;
  guest_name: string;
  guest_table?: string | null;
  drink_name: string;
  quantity: number;
  status: DrinkOrderStatus;
  created_at: string;
  delivered_at?: string | null;
};

export type ScreenMode = "live" | "photos" | "dance" | "brindes";

export type ScreenLiveSlide = { id: number; url: string; sort_order: number };

export type ScreenState = {
  mode: ScreenMode;
  active_media: { id: number; url: string; media_type: string } | null;
  live_slides: ScreenLiveSlide[];
};

export type ScreenToast =
  | { kind: "photo"; id: number; guest_name: string; url: string }
  | { kind: "message"; id: number; guest_name: string; message: string };

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { detail?: string | { msg: string }[] };
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail) && body.detail[0]?.msg) detail = body.detail[0].msg;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function mediaUrl(path: string) {
  if (path.startsWith("http")) return path;
  return apiUrl(path);
}

export async function fetchDrinksCatalog(category?: DrinkCategory): Promise<Drink[]> {
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(apiUrl(`/api/drinks${q}`));
  return parseJson<Drink[]>(res);
}

export async function submitDrinkOrderOpen(drinkId: number, quantity: number, guestTable: string) {
  const res = await fetch(apiUrl(`/api/drink-orders/open`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      drink_id: drinkId,
      quantity,
      guest_table: guestTable.trim(),
    }),
  });
  return parseJson<DrinkOrder>(res);
}

export async function sendFelicitationOpen(guestName: string, message: string) {
  const res = await fetch(apiUrl(`/api/felicitacoes/open`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guest_name: guestName.trim(), message: message.trim() }),
  });
  return parseJson<{ ok: boolean; id: number }>(res);
}

export async function fetchScreenState() {
  const res = await fetch(apiUrl(`/api/screen/state`));
  return parseJson<ScreenState>(res);
}

export async function fetchRecentFelicitacoes(limit = 40) {
  const res = await fetch(apiUrl(`/api/screen/recent-felicitacoes?limit=${limit}`));
  return parseJson<{ id: number; guest_name: string; message: string }[]>(res);
}

export async function fetchScreenToast(): Promise<ScreenToast | null> {
  const res = await fetch(apiUrl(`/api/screen/next-toast`));
  if (res.status === 204) return null;
  const data = await res.json();
  if (data === null) return null;
  return data as ScreenToast;
}

export async function fetchStaffDrinkOrders(status?: DrinkOrderStatus) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(apiUrl(`/api/drink-orders/staff${q}`));
  return parseJson<DrinkOrder[]>(res);
}

export async function updateDrinkOrderStatus(orderId: number, status: DrinkOrderStatus) {
  const res = await fetch(apiUrl(`/api/drink-orders/${orderId}/status`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return parseJson<DrinkOrder>(res);
}