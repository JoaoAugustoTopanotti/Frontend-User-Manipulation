"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import UserModal from "@/app/components/userModal";
import UserDeleteModal from "@/app/components/userDeleteModal";
import DeleteModal from "@/app/components/userDeleteModal";
import { MdChevronLeft } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";


function ListUsers({ users, onOpenModal, onDeleteModal }: { users: IUser[], onOpenModal: (user: IUser, editMode: boolean) => void; onDeleteModal: (userId: string | undefined) => void }) {
  console.log("oi")
  console.log(users);
  return (
    <>
      <div className="w-full flex justify-center items-start h-max[600px]">
        <div className="w-5/6 max-h-[600px] overflow-hidden border border-[var(--color-sidebarBorderColor)] shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-[var(--color-theadColor)] text-left">
              <tr>
                <th className="px-2 py-4">Nome</th>
                <th className="px-2 py-4">Email</th>
                <th className="px-2 py-4">Data de Nascimento</th>
                <th className="px-2 py-4">Telefone</th>
                <th className="px-2 py-4">CPF</th>
                <th className="px-2 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {users
                .map(user => (
                  <tr className="cursor-pointer" key={user.id} onClick={() => onOpenModal(user, false)}>
                    <td className="px-2 py-3">{user.name}</td>
                    <td className="px-2 py-3">{user.email}</td>
                    <td className="px-2 py-3">{user.birthDate}</td>
                    <td className="px-2 py-3">{user.contact}</td>
                    <td className="px-2 py-3">{user.nationalId}</td>
                    <td className="py-3 flex justify-start">
                      <button className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(user, true);
                      }}>
                        <MdModeEdit size="30" />
                      </button>
                      <button className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteModal(user.id)
                      }}>
                        <MdDelete size="30" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function UsersListWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedIdUser, setSelectedIdUser] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const { users, totalPages = 1, isLoading, error, refetch } = useUsers({ page, take });
  console.log("Users: ", users)

  const handleOpenModal = (user: IUser | null, editMode: boolean) => {
    setSelectedUser(user);
    setIsEdit(editMode);
    setIsModalOpen(true);
  };

  const handleDeleteModal = async (userId: string | undefined) => {
    setSelectedIdUser(userId);
    setIsModalDeleteOpen(true);
  }

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setSelectedIdUser("");
    setIsModalDeleteOpen(false)
  };

  const { handleSaveUser } = useUsers();

  const handleSave = async (updatedUser: IUser) => {
    if (updatedUser.id) {
      await handleSaveUser(updatedUser.id, updatedUser);
    } else {
      console.error("ID do usuário está indefinido");
    }

    setIsModalOpen(false);
    await refetch();
  };

  const handleEdit = () => {
    setIsEdit(true);
  }
  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  console.log("AAAA", { page, take, totalPages, users });

  return (
    <>
      <div className="h-1/12 w-9/10 items-top flex justify-end">
        <button className="h-1/2 w-1/7 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium" onClick={() => handleOpenModal(null, true)}>
          Cadastrar Usuário
        </button>
        <div className='flex flex-col md:flex-row md:justify-between mt-4 font-medium text-sm gap-4 items-center'>
        </div>
        <UserModal
          user={selectedUser}
          isEdit={isEdit}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          onEnableEdit={handleEdit}
        />
        <DeleteModal
          userId={selectedIdUser}
          isOpen={isModalDeleteOpen}
          onClose={handleCloseModal}
        />
      </div>
      <ListUsers users={users ?? []}
        onOpenModal={handleOpenModal}
        onDeleteModal={handleDeleteModal}
      />
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 w-5/6 text-sm p-4">

          {/* Mostrar */}
          <div className="flex items-center justify-start gap-2 w-full md:w-auto">
            <label htmlFor="take">Mostrar:</label>
            <select
              id="take"
              value={take}
              onChange={(e) => {
                setTake(Number(e.target.value));
                setPage(1); // volta pra primeira página ao mudar o tamanho
              }}
              className="border p-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-center gap-4 w-full mt-4 md:mt-0 mx-auto">
            <button
              className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Próxima
            </button>
          </div>

        </div>
      </div>

    </>
  );
}


export default UsersListWrapper