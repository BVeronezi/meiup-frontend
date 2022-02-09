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
    `https://meiup-api.herokuapp.com/api/v1/produtos`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, empresa, descricao: valuePesquisa },
    }
  );

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
