import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type ProdutoVenda = {
  id: string;
  produto: any;
  quantidade: number;
  precoUnidade: number;
  outrasDespesas: number;
  desconto: number;
  valorTotal: number;
};

type GetProdutoVendaResponse = {
  totalCount: number;
  produtosVenda: ProdutoVenda[];
};

export async function getProdutosVenda(
  page: number,
  vendaId?
): Promise<GetProdutoVendaResponse> {
  const response: any = await api.get(`/produtosVenda`, {
    params: { vendaId, page, limit: 10 },
  });

  const produtosVenda = response.data.found.produtosVenda.map((produto) => {
    return {
      id: produto.id,
      produto: produto.produto,
      quantidade: produto.quantidade,
      precoUnitario: produto.precoUnitario,
      outrasDespesas: produto.outrasDespesas,
      desconto: produto.desconto,
      valorTotal: produto.valorTotal,
    };
  });

  return {
    produtosVenda,
    totalCount: response.data.found.total,
  };
}

export function useProdutosVenda(
  page: number,
  vendaId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_venda", page]],
    () => getProdutosVenda(page, vendaId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoVendaResponse, unknown>;
}
