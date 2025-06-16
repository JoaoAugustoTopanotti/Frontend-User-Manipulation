"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import Link from "next/link";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function ListUsers({ users }: { users: IUser[] }) {
  return (
    <div className="flex flex-col pl-6 w-full h-1/2">
      <div className=" border border-[var(--color-sidebarBorderColor)] w-4/5 h-full relative shadow-md">
        <table className="w-full h-full">
          <thead className="bg-[var(--color-theadColor)] text-left h-1/6">
            <tr>
              <th className="px-2">Nome</th>
              <th className="px-2">Email</th>
              <th className="px-2">Data de Nascimento</th>
              <th className="px-2">Telefone</th>
              <th className="px-2">CPF</th>
              <th className="px-2">Ações</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-2 py-3">{user.name}</td>
                <td className="px-2 py-3">{user.email}</td>
                <td className="px-2 py-3">{user.birthDate}</td>
                <td className="px-2 py-3">{user.contact}</td>
                <td className="px-2 py-3">{user.nationalId}</td>
                <td className="py-3 flex justify-start">
                  <Link href="/users/edit">
                    <button>
                      <MdModeEdit size="30" />
                    </button>
                  </Link><button><MdDelete size="30" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// E no componente que chama a lista:

function UsersListWrapper() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <>
      <ListUsers users={users ?? []} />
      <div className="h-1/12 w-4/5 items-center flex justify-end">
        <button className="h-1/2 w-1/7 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium">
          Cadastrar Usuário
        </button>
      </div>
    </>
  );
}


export default UsersListWrapper