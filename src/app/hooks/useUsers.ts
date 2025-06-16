import { http } from "@/lib/http-common";
import { IUser } from "../interface/IUsers";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
    const getUsers = async (): Promise<IUser[]> => {
        const response = await http.get('/users/list?page=1&take=10&search=&orderBy[field]=&orderBy[direction]=desc');
        return response.data?.users?.data ?? [];
    }
    const {
        data: users,
        isLoading,
        error,
    } = useQuery<IUser[], Error>({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    return {
        users,
        isLoading,
        error,
    }
}
