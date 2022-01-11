import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

type ServicoVenda = {
  id: string;
  servico: any;
  precoUnidade: number;
  outrasDespesas: number;
  desconto: number;
  valorTotal: number;
};

type GetServicoVendaResponse = {
  totalCount: number;
  servicosVenda: ServicoVenda[];
};

export async function getServicosVenda(
  page: number,
  ctx,
  vendaId?
): Promise<GetServicoVendaResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const response: any = await axios.get(
    `http://localhost:8000/api/v1/servicosVenda`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { vendaId, page, limit: 10 },
    }
  );

  const servicosVenda = response.data.found.servicosVenda.map((p) => {
    return {
      id: p.id,
      servico: p.servico,
      precoUnitario: p.precoUnitario,
      outrasDespesas: p.outrasDespesas,
      desconto: p.desconto,
      valorTotal: p.valorTotal,
    };
  });

  return {
    servicosVenda,
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
    [["servicos_venda", page]],
    () => getServicosVenda(page, ctx, vendaId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetServicoVendaResponse, unknown>;
}
