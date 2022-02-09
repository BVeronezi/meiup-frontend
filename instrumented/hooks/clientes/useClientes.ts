import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  valuePesquisa?
): Promise<GetClienteResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(
    `https://meiup-api.herokuapp.com/api/v1/clientes`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, empresa, nome: valuePesquisa },
    }
  );

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

export function useClientes(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["clientes", page]], () => getClientes(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetClienteResponse, unknown>;
}
