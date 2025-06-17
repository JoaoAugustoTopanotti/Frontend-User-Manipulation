"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";

import { http } from "@/lib/http-common";

function ListUsers({ users }: { users: IUser[] }) {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handleUpdate = async () => {
    const userIdSystem = "dab3e7ab-9569-48c7-ae2c-52ef2596b251";

    if (!selectedUser) return;

    const updatedUser = {
      name,
      email,
      contact,
      birthDate,
      nationalId,
    }
    try {


      const token = localStorage.getItem('token');
      const updatedById = localStorage.getItem('updatedById');

      const response = await http.put(`/users/update/${selectedUser.id}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'updatedById': updatedById
        }
      })
      console.log("Usuário atualizado:", response.data);

    } catch (err: any) {
      console.error("Erro ao atualizar:", err);
      console.log("Detalhes do erro:", err?.response?.data || err.message);
    }
  }


  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setContact(selectedUser.contact ?? "");
      setBirthDate(selectedUser.birthDate ?? "");
      setNationalId(selectedUser.nationalId ?? "");
    }
  }, [selectedUser]);

  return (
    <>
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
                    <button onClick={() => {
                      setSelectedUser(user)
                      setIsModalEditOpen(true)
                    }}>
                      <MdModeEdit size="30" />
                    </button>
                    <button>
                      <MdDelete size="30" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalEditOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
            <div className="grid grid-cols-2 grid-rows-3 gap-4 h-auto">
              <div>
                <label htmlFor="Nome" className="block mb-2 text-shadow-lg font-medium">Nome:</label>
                <input type="text" id="name" className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none size-max"
                  placeholder={selectedUser?.name} value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="Contato" className="block mb-2 text-shadow-lg font-medium">Contato:</label>
                <input type="text" id="contact" className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                  placeholder={selectedUser?.contact} value={contact} onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="Email" className="block mb-2 text-shadow-lg font-medium">Email:</label>
                <input type="text" id="email" className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                  placeholder={selectedUser?.email} value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="Nascimento" className="block mb-2 text-shadow-lg font-medium">Nascimento:</label>
                <input type="text" id="birthDate" className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                  placeholder={selectedUser?.birthDate} value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="CPF" className="block mb-2 text-shadow-lg font-medium">CPF:</label>
                <input type="text" id="nationalId" className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                  placeholder={selectedUser?.nationalId} value={nationalId} onChange={(e) => setNationalId(e.target.value)}
                />
              </div>
            </div>
            <div className="text-end space-x-4">
              <button
                className="mt-4 bg-[var(--color-theadColor)] font-medium px-4 py-2 rounded "
                onClick={() => setIsModalEditOpen(false)}>
                Voltar
              </button>
              <button
                className="mt-4 bg-[var(--color-buttomColor)] text-white px-4 py-2 rounded "
                onClick={() => { handleUpdate() }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UsersListWrapper() {
  const { users, isLoading, error, refetch } = useUsers();

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