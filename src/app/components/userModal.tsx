"use client"
import React from 'react';
import { useEffect, useState } from "react";
import { IUser } from "../interface/IUsers";
import { useUsers } from "../hooks/useUsers";
import { v4 as uuidv4 } from 'uuid';
import * as z from "zod/v4";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Controller } from "react-hook-form";
import { InputMask } from './inputMask';
import { validateCPF } from "../../lib/CPFValidator"

interface Props {
    user: IUser | null;
    isEdit?: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: IUser) => void;
    onEnableEdit: () => void;
}

export default function UserModal({ user, isEdit = true, isOpen, onClose, onSave, onEnableEdit }: Props) {
    const User = z.object({
        name: z
            .string()
            .min(1, { message: "Nome é obrigatório." })
            .max(40, { message: "O nome pode ter no máximo 40 caracteres." })
            .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, {
                message: "O nome deve conter apenas letras e espaços.",
            })
            .refine((val) => val[0] === val[0]?.toUpperCase(), {
                message: "A primeira letra do nome deve ser maiúscula.",
            }),
        email: z.string().email({ message: 'Endereço de e-mail inválido' }).refine((val) => val.endsWith('@gmail.com'), {
            message: 'O e-mail deve terminar com @gmail.com',
        }),
        contact: z.string().refine(value => {
            const digits = value.replace(/\D/g, '');
            return digits.length === 11;
        }, {
            message: 'O número de telefone deve ter 11 dígitos.',
        }),
        birthDate: z.string().min(1, { message: 'A data de nascimento é obrigatória.' }),
        nationalId: z
            .string()
            .refine((value) => validateCPF(value), {
                message: "CPF inválido.",
            }),
        password: z.string().min(1, { message: 'A senha é obrigatória' }),
    });

    const UserEdit = z.object({
        name: z
            .string()
            .min(1, { message: "Nome é obrigatório." })
            .max(40, { message: "O nome pode ter no máximo 40 caracteres." })
            .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, {
                message: "O nome deve conter apenas letras e espaços.",
            })
            .refine((val) => val[0] === val[0]?.toUpperCase(), {
                message: "A primeira letra do nome deve ser maiúscula.",
            }),
        email: z.string().email({ message: 'Endereço de e-mail inválido' }).refine((val) => val.endsWith('@gmail.com'), {
            message: 'O e-mail deve terminar com @gmail.com',
        }),
        contact: z.string().refine(value => {
            const digits = value.replace(/\D/g, '');
            return digits.length === 11;
        }, {
            message: 'O número de telefone deve ter 11 dígitos.',
        }),
        birthDate: z.string().min(1, { message: 'A data de nascimento é obrigatória.' }),
        nationalId: z
            .string()
            .refine((value) => validateCPF(value), {
                message: "CPF inválido.",
            }),
        password: z.string().optional()
    });

    const { createUser, createUserLoading } = useUsers();
    const { handleSaveUser } = useUsers();

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                contact: user.contact,
                birthDate: user.birthDate,
                nationalId: user.nationalId,
                password: user.password,
            });
        }
    }, [user]);

    type user = z.infer<typeof User>

    const schema = user ? UserEdit : User;

    type FormSchema = z.infer<typeof schema>;

    const {
        register,
        reset,
        trigger,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            birthDate: new Date().toISOString(),
            nationalId: "",
            password: "",
        },
    });

    useEffect(() => {
        if (isOpen && !user) {
            reset({
                name: "",
                email: "",
                birthDate: "",
                contact: "",
                nationalId: "",
                password: "",
            });
        } else if (isOpen && user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                birthDate: user.birthDate || "",
                contact: user.contact || "",
                nationalId: user.nationalId || "",
                password: "",
            });
        trigger();
        }
    }, [isOpen, user, reset, trigger]);

    if (!isOpen) return null;

    const formatDateForInput = (dateISO: string | Date) => {
        const date = new Date(dateISO);

        // Ajusta para fuso local e formata yyyy-MM-dd
        const offset = date.getTimezoneOffset() * 60000; // diferença em ms
        const localDate = new Date(date.getTime() - offset);

        return localDate.toISOString().split("T")[0];
    };

    const handleSave = handleSubmit(async (data) => {
        console.log('Dados envios:');
        if (!user) return

        const updatedUser: IUser = {
            ...user,
            ...data
        };
        onSave(updatedUser);
        onClose()
    });

    const handleCreate = handleSubmit(async (data) => {
        const token = uuidv4();
        console.log(token)
        await createUser({
            ...data,
            token,
        });
        onClose(); // fecha o modal
    });
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">{!user ? "Cadastrar Usuário" : isEdit ? "Editar Usuário" : "Visualizar Usuário"}</h2>
                <div className="grid grid-cols-2 grid-rows-3 gap-4 h-auto">
                    <div>
                        <label className="block mb-2 font-medium">Nome:</label>
                        <input type="text" readOnly={!isEdit} {...register("name")}
                            className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Contato:</label>
                        <InputMask
                            name="contact"
                            mask="(00) 90000-0000"
                            control={control}
                            readOnly={!isEdit}
                        />
                        {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Email:</label>
                        <input type="text" readOnly={!isEdit} className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none" {...register("email")} />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Nascimento:</label>
                        <Controller name="birthDate" control={control} render={({ field }) => (
                            <input type="date" readOnly={!isEdit} max={new Date().toISOString().split("T")[0]} value={field.value ? formatDateForInput(field.value) : new Date().toISOString().split("T")[0]}
                                onChange={(e) => {
                                    const dateOnly = e.target.value;
                                    const iso = new Date(dateOnly).toISOString(); // formata pro backend
                                    field.onChange(iso); // manda o ISO pro react-hook-form
                                }}
                                className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                            />
                        )}
                        />
                        {errors.birthDate && <p className="text-red-500">{errors.birthDate.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">CPF:</label>
                        <InputMask
                            name="nationalId"
                            mask="000.000.000-00"
                            control={control}
                            readOnly={!isEdit}
                        />
                        {errors.nationalId && <p className="text-red-500">{errors.nationalId.message}</p>}
                    </div>
                    {!user && (
                        <div>
                            <label className="block mb-2 font-medium">Senha:</label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                    )}
                </div>
                <div className="text-end space-x-4 mt-4">
                    <button className="bg-gray-300 px-4 py-2 rounded cursor-pointer" onClick={onClose}>
                        Voltar
                    </button>
                    {!isEdit && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" onClick={onEnableEdit}>
                            Editar
                        </button>
                    )}
                    {isEdit && user && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" type="submit" onClick={handleSave}>
                            Salvar
                        </button>
                    )}
                    {!user && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" type="submit" onClick={handleCreate}>
                            Cadastrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
