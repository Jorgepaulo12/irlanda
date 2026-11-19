import { Link } from "react-router-dom";
import { DrinkCatalog } from "@/components/DrinkCatalog";
export function CatalogoPage() {
  return (
    <>
      <Link to="/" className="link-muted mx-auto mb-2 mt-6 block max-w-lg px-4 text-sm">
        ← Início
      </Link>
      <DrinkCatalog />
    </>
  );
}