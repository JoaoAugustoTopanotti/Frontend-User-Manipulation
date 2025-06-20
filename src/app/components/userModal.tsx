"use client"
import { useEffect, useState } from "react";
import { IUser } from "../interface/IUsers";
import { useUsers } from "../hooks/useUsers";
import { v4 as uuidv4 } from 'uuid';

interface Props {
    user?: IUser | null;
    isEdit?: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: IUser) => void;
    onEnableEdit: () => void;
}

export default function UserModal({ user = null, isEdit = true, isOpen, onClose, onSave, onEnableEdit }: Props) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [contact, setContact] = useState(user?.contact || "");
    const [birthDate, setBirthDate] = useState(user?.birthDate || "");
    const [nationalId, setNationalId] = useState(user?.nationalId || "");
    const [password, setPassword] = useState("");
    const { createUser, createUserLoading } = useUsers();
    const { handleSaveUser } = useUsers();

    useEffect(() => {
        if (isOpen && !user) {
            // Cadastro novo: limpa campos
            setName("");
            setEmail("");
            setBirthDate("");
            setContact("");
            setNationalId("");
            setPassword("")
        } else if (isOpen && user) {
            // Edição: preenche campos com dados do usuário
            setName(user.name || "");
            setEmail(user.email || "");
            setBirthDate(user.birthDate || "");
            setContact(user.contact || "");
            setNationalId(user.nationalId || "");
        }
    }, [isOpen, user]);


    if (!isOpen) return null;

    const formatDateForInput = (isoString: string) => {
        return isoString ? isoString.split('T')[0] : '';
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateOnly = e.target.value; // Ex: "2025-06-16"
        const isoWithTime = new Date(dateOnly).toISOString(); // Transforma para ISO completo
        setBirthDate(isoWithTime); // Salva a data no formato correto para o backend
    };

    const handleSave = async () => {
        if (!user) return
        const updatedUser: IUser = {
            ...user,
            name,
            email,
            contact,
            birthDate,
            nationalId,
        };
        console.log("Updated User: ", updatedUser)
        onSave(updatedUser);
        onClose()
    };

    const handleCreate = async () => {
        const token = uuidv4();
        console.log(token)
        await createUser({
            name,
            email,
            birthDate,
            contact,
            nationalId,
            password,
            token,
        });

        onClose(); // fecha o modal
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">{!user ? "Cadastrar Usuário" : isEdit ? "Editar Usuário" : "Visualizar Usuário"}</h2>
                <div className="grid grid-cols-2 grid-rows-3 gap-4 h-auto">
                    <div>
                        <label className="block mb-2 font-medium">Nome:</label>
                        <input type="text" value={name} readOnly={!isEdit} onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Contato:</label>
                        <input type="text" value={contact} readOnly={!isEdit} onChange={(e) => setContact(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Email:</label>
                        <input type="text" value={email} readOnly={!isEdit} onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Nascimento:</label>
                        <input type="date" value={formatDateForInput(birthDate)} readOnly={!isEdit} onChange={handleDateChange}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">CPF:</label>
                        <input type="text" value={nationalId} readOnly={!isEdit} onChange={(e) => setNationalId(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    {!user && (
                        <div>
                            <label className="block mb-2 font-medium">Senha:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                        </div>
                    )}
                </div>

                <div className="text-end space-x-4 mt-4">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                        Voltar
                    </button>
                    {!isEdit && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onEnableEdit}>
                            Editar
                        </button>
                    )}
                    {isEdit && user && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>
                            Salvar
                        </button>
                    )}
                    {!user && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>
                            Cadastrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
