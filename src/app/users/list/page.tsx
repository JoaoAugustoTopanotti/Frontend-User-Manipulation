"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import UserModal from "@/app/components/userModal";
import { useUpdateUser } from "@/app/hooks/useUpdateUsers";

function ListUsers({ users, refetch }: { users: IUser[], refetch: () => Promise<any>;}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handleOpenModal = (user: IUser, editMode: boolean) => {
    setSelectedUser(user);
    setIsEdit(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const { handleSaveUser } = useUpdateUser();

  const handleSave = async (updatedUser: IUser) => {
    await handleSaveUser(updatedUser.id, updatedUser);
    setIsModalOpen(false);
    await refetch();
  };

  const handleEdit = () => {
    setIsEdit(true);  
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
                <tr className="cursor-pointer" key={user.id} onClick={() => handleOpenModal(user, false)}>
                  <td className="px-2 py-3">{user.name}</td>
                  <td className="px-2 py-3">{user.email}</td>
                  <td className="px-2 py-3">{user.birthDate}</td>
                  <td className="px-2 py-3">{user.contact}</td>
                  <td className="px-2 py-3">{user.nationalId}</td>
                  <td className="py-3 flex justify-start">
                    <button className="cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(user, true);
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
        <UserModal
          user={selectedUser}
          isEdit={isEdit}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          onEnableEdit={handleEdit}
        />
      </div>
    </>
  );
}

function UsersListWrapper() {
  const { users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <>
      <ListUsers users={users ?? []} refetch={refetch}/>
      <div className="h-1/12 w-4/5 items-center flex justify-end">
        <button className="h-1/2 w-1/7 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium">
          Cadastrar Usuário
        </button>
      </div>
    </>
  );
}

export default UsersListWrapper