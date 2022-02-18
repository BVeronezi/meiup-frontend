import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Cliente = {
  id: string;
  nome: string;
  email: string;
  celular: string;
};

type GetClienteResponse = {
  totalCount: number;
  clientes: Cliente[];
};

export async function getClientes(
  page: number,
  valuePesquisa?
): Promise<GetClienteResponse> {
  const response: any = await api.get(`/clientes`, {
    params: { page, nome: valuePesquisa },
  });

  const clientes = response.data.found.clientes.map((cliente) => {
    return {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      celular: cliente.celular,
    };
  });

  return {
    clientes,
    totalCount: response.data.found.total,
  };
}

export function useClientes(page: number, options?: UseQueryOptions) {
  return useQuery([["clientes", page]], () => getClientes(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetClienteResponse, unknown>;
}
