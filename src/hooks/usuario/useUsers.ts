import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
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
  ctx,
  valuePesquisa?
): Promise<GetUserResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(
    `http://localhost:8000/api/v1/usuario`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, empresa, descricao: valuePesquisa },
    }
  );

  const users = response.data.found.users.map((user) => {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      createdAt: new Date(user.dataCriacao).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    users,
    totalCount: 10,
  };
}

export function useUsuarios(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["usuarios", page]], () => getUsuarios(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetUserResponse, unknown>;
}
