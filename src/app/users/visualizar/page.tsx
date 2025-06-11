import React, { ReactNode } from "react";


export default function ListUsers() {
  return (
    <div className="flex flex-col pl-6 w-full h-full">
      <div className="border-4 w-4/5 h-2/3"></div>
      <div className="bg-orange-200 h-1/12 w-4/5 items-center flex justify-end pr-6">
        <button className="bg-purple-200 h-1/2   ">Cadastrar Usuário </button>
      </div>
    </div>
  )
}