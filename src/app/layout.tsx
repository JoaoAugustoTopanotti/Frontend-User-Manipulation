import { ReactNode } from "react";
import { Sidebar } from "./components/sidebar";
import "./globals.css"; // se estiver usando estilos globais
import { ReactQueryProvider } from "@/lib/reactQueryProvider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactQueryProvider>
          <div className="bg-white h-screen flex flex-row">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
