import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

type Categoria = {
  id: string;
  nome: string;
};

type GetCategoriaResponse = {
  totalCount: number;
  categorias: Categoria[];
};

export async function getCategorias(
  page: number,
  ctx,
  valuePesquisa?
): Promise<GetCategoriaResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(`${process.env.API_URL}/categorias`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, empresa, nome: valuePesquisa },
  });

  const categorias = response.data.found.categorias.map((categoria) => {
    return {
      id: categoria.id,
      nome: categoria.nome,
    };
  });

  return {
    categorias,
    totalCount: response.data.found.total,
  };
}

export function useCategorias(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["categorias", page]], () => getCategorias(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetCategoriaResponse, unknown>;
}
