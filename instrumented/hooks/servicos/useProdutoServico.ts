import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type ProdutoServico = {
  id: string;
  servico: any;
  produto: any;
  quantidade: number;
};

type GetProdutoServicoResponse = {
  totalCount: number;
  produtosServico: ProdutoServico[];
};

export async function getProdutoServico(
  page: number,
  servicoId?
): Promise<GetProdutoServicoResponse> {
  const response: any = await api.get(`/produtosServico`, {
    params: { servicoId, page, limit: 10 },
  });

  const produtos = response.data.found.produtosServico ?? [];

  const produtosServico = produtos.map((s) => {
    return {
      id: s.id,
      servico: s.servico,
      produto: s.produto,
      quantidade: s.quantidade,
    };
  });

  return {
    produtosServico,
    totalCount: response.data.found.total,
  };
}

export function useProdutosServico(
  page: number,
  servicoId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_servico", page]],
    () => getProdutoServico(page, servicoId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoServicoResponse, unknown>;
}
