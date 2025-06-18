"use client";

import { http } from "@/lib/http-common";
import { IUser } from "../interface/IUsers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AxiosResponse } from "axios";
import { ICreateUser } from "../interface/IUserCreate";

export const useUsers = () => {
    const getUsers = async (): Promise<IUser[]> => {
        const response = await http.get('/users/list?page=1&take=10&search=&orderBy[field]=&orderBy[direction]=desc');
        return response.data?.users?.data ?? [];
    };

    const {
        data: users,
        isLoading,
        error,
        refetch,
    } = useQuery<IUser[], Error>({
        queryKey: ['users'],
        queryFn: getUsers,
    });
    const updatedById = localStorage.getItem('updatedById');
    const createUserMutation = useMutation<AxiosResponse<any>, Error, ICreateUser>({
        mutationFn: (newUser) =>
            http.post(
                '/users/create',
                {
                    ...newUser,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: newUser.token || '', // envia o token no header
                        user: updatedById || ''
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

    return {
        users,
        isLoading,
        error,
        refetch,
        createUser: createUserMutation.mutateAsync,
        createUserLoading: createUserMutation.status === "pending",
    };
};
