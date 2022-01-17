import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  valuePesquisa?
): Promise<GetProdutoResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(
    `http://localhost:8000/api/v1/produtos`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, empresa, descricao: valuePesquisa },
    }
  );

  const produtos = response.data.found.produtos.map((produto) => {
    return {
      id: produto.id,
      descricao: produto.descricao,
      categoria: produto.categoria?.nome ?? "-",
      precoVarejo: (produto.precos?.precoVendaVarejo
        ? Number(produto.precos?.precoVendaVarejo)
        : 0
      ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
    };
  });

  return {
    produtos,
    totalCount: response.data.found.total,
  };
}

export function useProdutos(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["produtos", page]], () => getProdutos(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetProdutoResponse, unknown>;
}
