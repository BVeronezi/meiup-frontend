import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";
type User = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  createdAt: string;
};

type GetUserResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsuarios(
  page: number,
  valuePesquisa?
): Promise<GetUserResponse> {
  const response: any = await api.get(`/usuario`, {
    params: { page, nome: valuePesquisa },
  });

  const users = response.data.found.users.map((user) => {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.tipo,
      createdAt: new Date(user.dataCriacao).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }),
    };
  });

  return {
    users,
    totalCount: 10,
  };
}

export function useUsuarios(page: number, options?: UseQueryOptions) {
  return useQuery([["usuarios", page]], () => getUsuarios(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetUserResponse, unknown>;
}
