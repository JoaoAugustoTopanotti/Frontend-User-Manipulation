"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
import UserModal from "@/app/components/userModal";
import debounce from 'lodash.debounce';
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
  const [pageInput, setPageInput] = useState<string | number>(page);
  const [searchRaw, setSearchRaw] = useState("");
  const [search, setSearch] = useState("");
  const [isEditingPage, setIsEditingPage] = useState(false);
  const { users, totalPages = 1, isLoading, error, refetch } = useUsers({ page, take, search });
  console.log("Users: ", users)

  const debouncedSearch = useMemo(() => debounce((value: string) => {
    setSearch(value);
    setPage(1); // resetar para a primeira página ao mudar busca
  }, 1200), []);

  useEffect(() => {
    debouncedSearch(searchRaw);
    return () => {
      debouncedSearch.cancel(); // evita vazamentos
    };
  }, [searchRaw]);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  const handlePageChange = () => {
    const number = Number(pageInput);

    if (isNaN(number) || number < 1) {
      setPage(1);
      setPageInput(1);
      return;
    }

    const sanitized = Math.min(number, totalPages);

    setPage(sanitized);
    setPageInput(sanitized);
  };

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
      <div className="flex justify-center h-1/12 w-full">
        <div className="w-5/6 flex items-center justify-between font-medium text-sm gap-4">
          <input
            type="text"
            placeholder="Pesquisar usuário..."
            value={searchRaw}
            onChange={(e) => setSearchRaw(e.target.value)}
            className="p-2 border border-gray-300 focus:outline-none rounded w-64 mx-auto"
          />
          <button
            className="h-10 px-4 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium"
            onClick={() => handleOpenModal(null, true)}
          >
            Cadastrar Usuário
          </button>
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
      </div>
      <ListUsers users={users ?? []}
        onOpenModal={handleOpenModal}
        onDeleteModal={handleDeleteModal}
      />
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center w-5/6 text-sm p-4">
          {/* Mostrar */}
          <div className="w-full flex items-center justify-between gap-4 ">
            <label htmlFor="take" className="block">
              Mostrar:
              <select
                id="take"
                value={take}
                onChange={(e) => {
                  setTake(Number(e.target.value));
                  setPage(1); // volta pra primeira página ao mudar o tamanho
                }}
                className="mt-1 w-full max-w-[120px] rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm  focus:outline-none focus:ring-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>

            {/* Paginação */}
            <div className="flex items-center justify-center gap-4 w-full mt-4 md:mt-0 mx-auto">
              <button
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
            <div className="justify-end w-1/7">
              Página
              <input
                type="number"
                value={pageInput}
                onFocus={() => setIsEditingPage(true)}
                onBlur={() => {
                  setIsEditingPage(false);
                  handlePageChange();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setPageInput(val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingPage(false);
                    handlePageChange();
                  }
                }}
                className="w-7 border border-gray-300 rounded text-center focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={1}
                max={totalPages}
              />
              de {totalPages}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default UsersListWrapper