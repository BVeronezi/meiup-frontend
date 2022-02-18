import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

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
  valuePesquisa?
): Promise<GetCategoriaResponse> {
  const response: any = await api.get(`/categorias`, {
    params: { page, nome: valuePesquisa },
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

export function useCategorias(page: number, options?: UseQueryOptions) {
  return useQuery([["categorias", page]], () => getCategorias(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetCategoriaResponse, unknown>;
}
