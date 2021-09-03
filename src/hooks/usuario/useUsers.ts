import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type User = {
    id: string;
    nome: string;
    email: string;
    createdAt: string;
}

type GetUserResponse = {
    totalCount: number;
    users: User[];
}

export async function getUsers(page: number): Promise<GetUserResponse> {
    const response: any = await api.get('/usuario', {
        params: {
            page,
            limit: 100,
        }
    });

    const users = response.data.found.users.map(user => {
        return {
            id: user.id,
            nome: user.name,
            email: user.email,
            createdAt: new Date(user.dataCriacao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        users,
        totalCount: 10
    };
}

export function useUsers(page: number, options?: UseQueryOptions) {
    return useQuery([['users', page]], () => getUsers(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    }) as UseQueryResult<GetUserResponse, unknown>
}