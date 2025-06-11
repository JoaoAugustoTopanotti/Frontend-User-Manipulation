import { ReactNode } from "react";
import { Header } from "../components/header";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}