import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type ProdutoPromocao = {
  id: string;
  produto: any;
  precoPromocional: number;
};

type GetProdutoPromocaoResponse = {
  totalCount: number;
  produtosPromocao: ProdutoPromocao[];
};

export async function getProdutoPromocao(
  page: number,
  promocaoId?
): Promise<GetProdutoPromocaoResponse> {
  const response: any = await api.get(`/produtosPromocao`, {
    params: { promocaoId, page, limit: 10 },
  });

  const produtosPromocao = response.data.found.produtosPromocao.map((p) => {
    return {
      id: p.id,
      produto: p.produto,
      precoPromocional: p.precoPromocional,
    };
  });

  return {
    produtosPromocao,
    totalCount: response.data.found.total,
  };
}

export function useProdutosPromocao(
  page: number,
  promocaoId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_promocao", page]],
    () => getProdutoPromocao(page, promocaoId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoPromocaoResponse, unknown>;
}
