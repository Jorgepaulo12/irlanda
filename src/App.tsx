import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "@/pages/HomePage";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { FelicitacoesPage } from "@/pages/FelicitacoesPage";
import { EnviarFelicitationPage } from "@/pages/EnviarFelicitationPage";
import { GarcomPage } from "@/pages/GarcomPage";
import { LivroPage } from "@/pages/LivroPage";
import { IrlandaPageShell } from "@/components/IrlandaPageShell";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IrlandaPageShell>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/garcom" element={<GarcomPage />} />
          <Route path="/felicitacoes" element={<FelicitacoesPage />} />
          <Route path="/felicitacoes/enviar" element={<EnviarFelicitationPage />} />
          <Route path="/livro" element={<LivroPage />} />
          <Route path="/felicitacoes-tela" element={<Navigate to="/felicitacoes" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </IrlandaPageShell>
    </QueryClientProvider>
  );
}