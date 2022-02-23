import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type ProdutoFornecedor = {
  id: string;
  fornecedor: any;
};

type GetProdutoFornecedorResponse = {
  totalCount: number;
  produtoFornecedores: ProdutoFornecedor[];
};

export async function getProdutoFornecedor(
  page: number,
  produtoId?
): Promise<GetProdutoFornecedorResponse> {
  const response: any = await api.get(`/produtosFornecedor`, {
    params: { produtoId, page, limit: 10 },
  });

  const fornecedores = response.data.found.produtosFornecedores ?? [];

  const produtoFornecedores = fornecedores.map((s) => {
    return {
      id: s.id,
      fornecedor: s.fornecedor,
    };
  });

  return {
    produtoFornecedores,
    totalCount: response.data.found.total,
  };
}

export function useProdutoFornecedores(
  page: number,
  servicoId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_fornecedores", page]],
    () => getProdutoFornecedor(page, servicoId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoFornecedorResponse, unknown>;
}
