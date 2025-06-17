"use client"
import { useEffect, useState } from "react";
import { IUser } from "../interface/IUsers";
import { useUpdateUser } from "../hooks/useUpdateUsers";

interface Props {
    user: IUser | null;
    isEdit: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: IUser) => void;
    onEnableEdit: () => void;
}

export default function UserModal({ user, isEdit, isOpen, onClose, onSave, onEnableEdit }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [nationalId, setNationalId] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setContact(user.contact ?? "");
            setBirthDate(user.birthDate ?? "");
            setNationalId(user.nationalId ?? "");
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const { handleSaveUser } = useUpdateUser();

    const handleSave = async () => {
        if(!user) return 
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

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">{isEdit ? "Editar Usuário" : "Visualizar Usuário"}</h2>
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
                        <input type="text" value={birthDate} readOnly={!isEdit} onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">CPF:</label>
                        <input type="text" value={nationalId} readOnly={!isEdit} onChange={(e) => setNationalId(e.target.value)}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                    </div>
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
                    {isEdit && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>
                            Salvar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
