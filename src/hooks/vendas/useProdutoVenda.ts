import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  vendaId?
): Promise<GetProdutoVendaResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const response: any = await axios.get(
    `http://localhost:8000/api/v1/produtosVenda`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { vendaId, page },
    }
  );

  const produtosVenda = response.data.found.produtosVenda.map((p) => {
    return {
      id: p.id,
      produto: p.produto,
      quantidade: p.quantidade,
      precoUnitario: p.precoUnitario,
      outrasDespesas: p.outrasDespesas,
      desconto: p.desconto,
      valorTotal: p.valorTotal,
    };
  });

  return {
    produtosVenda,
    totalCount: response.data.found.total,
  };
}

export function useProdutosVenda(
  page: number,
  ctx = undefined,
  vendaId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_venda", page]],
    () => getProdutosVenda(page, ctx, vendaId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoVendaResponse, unknown>;
}
