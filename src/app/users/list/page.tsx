"use client";

import { useUsers } from "@/app/hooks/useUsers";
import { IUser } from "@/app/interface/IUsers";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
import UserModal from "@/app/components/userModal";
import debounce from 'lodash.debounce';
import React from 'react';
import DeleteModal from "@/app/components/userDeleteModal";
import { FaCaretDown, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

function ListUsers({ users, onOpenModal, onDeleteModal, orderByField, setOrderByField, orderByDirection, setOrderByDirection }: { users: IUser[], onOpenModal: (user: IUser, editMode: boolean) => void; onDeleteModal: (userId: string | undefined) => void; orderByField: string; setOrderByField: (field: string) => void; orderByDirection: string; setOrderByDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc' | 'default'>>; }) {

  const getOrderIcon = (fieldName: string) => {
    if (orderByField !== fieldName) return <FaSort />;

    if (orderByDirection === 'asc') return <FaSortUp />;
    if (orderByDirection === 'desc') return <FaSortDown />;
    return <FaSort />;
  };

  const orderCycle = {
    default: 'asc',
    asc: 'desc',
    desc: 'default',
  } as const;

  const toggleOrderDirection = () => {
    setOrderByDirection((prev) => orderCycle[prev]);
  };
  return (
    <>
      <div className="w-full flex justify-center items-start h-max[600px]">
        <div className="w-5/6 overflow-hidden border border-[var(--color-sidebarBorderColor)] rounded-2xl shadow-md">
          <table className="w-full table-fixed overflow-scroll">
            <thead className="text-left border-b border-[var(--color-sidebarBorderColor)]">
              <tr>
                <th className="px-4 py-3 w-2/11">
                  <div className="flex items-center gap-1">
                    Nome
                    <button className="p-1 justify-center items-center cursor-pointer" onClick={() => { setOrderByField("name"); toggleOrderDirection() }}>
                      {getOrderIcon("name")}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 w-3/11">
                  <div className="flex items-center gap-1">
                    Email
                    <button className="p-1 cursor-pointer" onClick={() => { setOrderByField("email"); toggleOrderDirection() }}>
                      {getOrderIcon("email")}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 w-2/11">
                  <div className="flex items-center gap-1">
                    Data de Nascimento
                    <button className="p-1 cursor-pointer" onClick={() => { setOrderByField("birthDate"); toggleOrderDirection() }}>
                      {getOrderIcon("birthDate")}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 w-2/11">
                  <div className="flex items-center gap-1">
                    Telefone
                    <button className="p-1 cursor-pointer" onClick={() => { setOrderByField("contact"); toggleOrderDirection() }}>
                      {getOrderIcon("contact")}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 w-2/11">
                  <div className="flex items-center gap-1">
                    CPF
                    <button className="p-1 cursor-pointer" onClick={() => { setOrderByField("nationalId"); toggleOrderDirection() }}>
                      {getOrderIcon("nationalId")}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 w-1/11">Ações</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {users
                .map((user, index) => (
                  <React.Fragment key={user.id}>
                    <tr key={user.id} onClick={() => onOpenModal(user, false)}>
                      <td className="px-4 py-3 w-1/6 ">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 w-2/6">{user.email.length > 30 ? user.email.slice(0, 20) + '...' : user.email}</td>
                      <td className="px-4 py-3 w-1/6">
                        {new Date(user.birthDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 w-1/6">
                        {user.contact}
                      </td>
                      <td className="px-4 py-3 w-1/6">
                        {user.nationalId}
                      </td>
                      <td className="px-4 py-3 w-1/6 flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onOpenModal(user, true); }}>
                          <MdModeEdit size={30} className="cursor-pointer" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteModal(user.id); }}>
                          <MdDelete size={30} className="cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                    {index < users.length - 1 && (
                      <tr>
                        <td colSpan={6} className="px-0">
                          <div className="w-[calc(100%-7rem)] mx-4 border-b border-gray-300"></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
  const [orderByField, setOrderByField] = useState("")
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc' | 'default'>('default');
  const [pageInput, setPageInput] = useState<string | number>(page);
  const [searchRaw, setSearchRaw] = useState("");
  const [search, setSearch] = useState("");
  const [isEditingPage, setIsEditingPage] = useState(false);
  const { users, totalPages = 1, isLoading, error, refetch } = useUsers({ page, take, search, orderByField, orderByDirection });

  const debouncedSearch = useMemo(() => debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 502), []);

  useEffect(() => {
    debouncedSearch(searchRaw);
    return () => {
      debouncedSearch.cancel();
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
    await refetch();
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
  if (error) return <p>Erro: {error.message}</p>

  return (
    <>
      <div className="flex justify-center h-1/12 w-full">
        <div className="w-5/6 flex items-center justify-between font-medium text-sm  gap-4">
          <div className="flex flex-col items-start pb-4 mx-auto">
            <input
              type="text"
              id="search"
              placeholder="Pesquisar usuário..."
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              className="w-2xl border border-gray-300 focus:outline-none text-base hover:border-blue-500 rounded-2xl px-4 py-2.5"
            />
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
            onDeleteSuccess={refetch}
          />
          <button
            className="h-10 px-4 bg-[var(--color-buttomColor)] rounded-lg text-white font-medium cursor-pointer hover:bg-blue-700"
            onClick={() => handleOpenModal(null, true)}
          >
            Cadastrar Usuário
          </button>
        </div>
      </div>
      <ListUsers users={users ?? []}
        onOpenModal={handleOpenModal}
        onDeleteModal={handleDeleteModal}
        orderByField={orderByField}
        orderByDirection={orderByDirection}
        setOrderByField={setOrderByField}
        setOrderByDirection={setOrderByDirection}
      />
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center w-5/6 text-sm p-4">
          <div className="w-full flex items-center justify-between gap-4 ">
            <label htmlFor="take" className="block">
              Mostrar
              <select
                id="take"
                value={take}
                onChange={(e) => {
                  setTake(Number(e.target.value));
                  setPage(1);
                }}
                className="mt-1 w-full max-w-[160px] rounded-md border border-gray-300 bg-white py-1 px-6 text-sm text-gray-700 shadow-sm  focus:outline-none focus:ring-1 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <div className="flex items-center justify-center gap-4 w-full mt-4 md:mt-0 mx-auto">
              <button
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
            <div className="flex gap-1 justify-end w-1/7 text-base">
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
      <div className="w-full flex justify-end">
        <div className="flex w-1/6 mr-3">

        </div>
      </div>
    </>
  );
}

export default UsersListWrapper