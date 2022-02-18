import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Produto = {
  id: string;
  descricao: string;
  categoria: string;
  precoVarejo: string;
};

type GetProdutoResponse = {
  totalCount: number;
  produtos: Produto[];
};

export async function getProdutos(
  page: number,
  valuePesquisa?
): Promise<GetProdutoResponse> {
  const response: any = await api.get(`/produtos`, {
    params: { page, descricao: valuePesquisa },
  });

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const produtos = response.data.found.produtos.map((produto) => {
    return {
      id: produto.id,
      descricao: produto.descricao,
      categoria: produto.categoria?.nome ?? "-",
      precoVarejo: formatter.format(
        produto.precos ? Number(produto.precos?.precoVendaVarejo) : 0
      ),
    };
  });

  return {
    produtos,
    totalCount: response.data.found.total,
  };
}

export function useProdutos(page: number, options?: UseQueryOptions) {
  return useQuery([["produtos", page]], () => getProdutos(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetProdutoResponse, unknown>;
}
