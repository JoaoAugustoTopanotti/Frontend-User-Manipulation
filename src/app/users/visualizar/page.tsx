import React, { ReactNode } from "react";


export default function ListUsers() {
  return (
    <div className="flex flex-col pl-6 w-full h-full">
      <div className="border border-[var(--color-sidebarBorderColor)] w-4/5 h-2/3"></div>
      <div className="h-1/12 w-4/5 items-center flex justify-end pr-6">
        <button className="h-1/2 w-1/7 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium">Cadastrar Usuário </button>
      </div>
    </div>
  )
}