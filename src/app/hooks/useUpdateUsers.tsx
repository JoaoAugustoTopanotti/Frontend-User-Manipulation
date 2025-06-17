// hooks/useUpdateUser.ts
import { http } from "@/lib/http-common";
import { IUser } from "../interface/IUsers";

export const useUpdateUser = () => {
    const handleSaveUser = async (userId: string, updatedUser: IUser) => {
        if (!userId) return;

        try {
            const token = localStorage.getItem('token');
            const updatedById = localStorage.getItem('updatedById');

            const response = await http.put(`/users/update/${userId}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                    token: token ?? '',
                    updatedById: updatedById ?? ''
                }
            });

            console.log("Usuário atualizado:", response.data);
            return response.data;

        } catch (err: any) {
            console.error("Erro ao atualizar:", err);
            throw err;
        }
    };
    return { handleSaveUser };
};
