import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  servicoId?
): Promise<GetProdutoServicoResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const response: any = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/produtosServico`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { servicoId, page, limit: 10 },
    }
  );

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

export function useServicosVenda(
  page: number,
  ctx = undefined,
  vendaId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["produtos_servico", page]],
    () => getProdutoServico(page, ctx, vendaId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetProdutoServicoResponse, unknown>;
}
