import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Promocao = {
  id: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
};

type GetPromocaoResponse = {
  totalCount: number;
  promocoes: Promocao[];
};

export async function getPromocoes(
  page: number,
  valuePesquisa?
): Promise<GetPromocaoResponse> {
  const response: any = await api.get("/promocoes", {
    params: { page, descricao: valuePesquisa },
  });

  const promocoes = response.data.found.promocoes.map((promocao) => {
    return {
      id: promocao.id,
      descricao: promocao.descricao,
      dataInicio: new Date(promocao.dataInicio).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }),
      dataFim: new Date(promocao.dataFim).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }),
    };
  });

  return {
    promocoes,
    totalCount: response.data.found.total,
  };
}

export function usePromocoes(page: number, options?: UseQueryOptions) {
  return useQuery([["promocoes", page]], () => getPromocoes(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetPromocaoResponse, unknown>;
}
