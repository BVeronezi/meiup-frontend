import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

type ServicoVenda = {
  id: string;
  servico: any;
  valorServico: number;
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

  const servicos = response.data.found.servicosVenda ?? [];
  let servicosVenda = [];

  if (servicos.length > 0) {
    servicosVenda = servicos.map((servico) => {
      return {
        id: servico.id,
        servico: servico.servico,
        valorServico: (servico.valorServico
          ? Number(servico.valorServico)
          : 0
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
        outrasDespesas: (servico.outrasDespesas
          ? Number(servico.outrasDespesas)
          : 0
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
        desconto: (servico.desconto
          ? Number(servico.desconto)
          : 0
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
        valorTotal: (servico.valorTotal
          ? Number(servico.valorTotal)
          : 0
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" }),
      };
    });
  }

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
