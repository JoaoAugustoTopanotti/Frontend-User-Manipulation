// hooks/useUsers.ts
"use client";

import { http } from "@/lib/http-common";
import { GetUsersParams, IUser } from "../interface/IUsers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { UseUsersOptions } from "../interface/IUseUsersOptions";

const getUsers = async ({ queryKey }: { queryKey: any }): Promise<{ users: IUser[]; total: number; totalPages: number }> => {
    const [_key, page, take, search, orderByField, orderByDirection] = queryKey;
    const response = await http.get(`/users/list?page=${page}&take=${take}&search=${search}&orderBy[field]=${orderByField}&orderBy[direction]=${orderByDirection}`);
    return {
        users: response.data?.users?.data ?? [],
        total: response.data?.users?.total ?? 0,
        totalPages: response.data?.users?.totalPages ?? 1,
    };
};

export const useUsers = ({ page = 1, take = 5, search = "", orderByField = "", orderByDirection = "" }: UseUsersOptions = {}) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<{ users: IUser[]; total: number; totalPages: number }, Error>({
        queryKey: ['users', page, take, search, orderByField, orderByDirection],
        queryFn: getUsers,
        placeholderData: (prevData) => prevData
    }, );
    const updatedById = localStorage.getItem('updatedById');

    const createUserMutation = useMutation<AxiosResponse<any>, Error, IUser>({
        mutationFn: (newUser) =>
            http.post(
                '/users/create',
                { ...newUser },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: newUser.token || '',
                        user: updatedById || '',
                    },
                }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err) => {
            console.error("Erro ao criar usuário:", err);
        },
    });

    const handleSaveUser = async (userId: string, updatedUser: IUser) => {
        if (!userId) return;

        try {
            let token = '';
            if (typeof window !== 'undefined') {
                token = localStorage.getItem("token") ?? '';
            }

            let updatedById = '';
            if (typeof window !== 'undefined') {
                updatedById = localStorage.getItem("updatedById") ?? '';
            }

            const response = await http.put(`/users/update/${userId}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                    token: token ?? '',
                    updatedById: updatedById ?? ''
                }
            });
            return response.data;
        } catch (err: any) {
            console.error("Erro ao atualizar:", err);
            throw err;
        }
    };
    const handleDeleteUser = async (userId: string) => {
        if (!userId) return;

        try {
            let token = '';
            if (typeof window !== 'undefined') {
                token = localStorage.getItem("token") ?? '';
            }

            let deletedById = '';
            if (typeof window !== 'undefined') {
                deletedById = localStorage.getItem("deletedById") ?? '';
            }

            const response = await http.delete(`/users/delete/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    token: token ?? '',
                    deletedById: deletedById ?? ''
                }
            });
            console.log("Usuário atualizado:", response.data);
            return response.data;
        }
        catch (err: any) {
            console.error("Erro ao atualizar:", err);
            throw err;
        };
    };
    return {
        users: data?.users ?? [],
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        error,
        refetch,
        createUser: createUserMutation.mutateAsync,
        createUserLoading: createUserMutation.status === "pending",
        handleSaveUser, // exporta a função de update também
        handleDeleteUser,
    };
};
