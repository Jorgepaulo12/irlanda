export const DRINK_CATEGORIES = [
  "CERVEJA",
  "VINHOS",
  "WHISKY",
  "CHAMPANHE",
  "SUMOS",
  "REFRIGERANTE",
  "OUTRAS",
] as const;

export type DrinkCategory = (typeof DRINK_CATEGORIES)[number];

export const DRINK_CATEGORY_LABEL: Record<DrinkCategory, string> = {
  CERVEJA: "Cerveja",
  VINHOS: "Vinhos",
  WHISKY: "Whisky",
  CHAMPANHE: "Champanhe",
  SUMOS: "Sumos",
  REFRIGERANTE: "Refrigerante",
  OUTRAS: "Outras",
};