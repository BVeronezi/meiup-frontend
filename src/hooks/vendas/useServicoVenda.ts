import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

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
  vendaId?
): Promise<GetServicoVendaResponse> {
  const response: any = await api.get(`/servicosVenda`, {
    params: { vendaId, page, limit: 10 },
  });

  const servicos = response.data.found.servicosVenda ?? [];
  let servicosVenda = [];

  if (servicos.length > 0) {
    servicosVenda = servicos.map((servico) => {
      return {
        id: servico.id,
        servico: servico.servico,
        valorServico: servico.valorServico,
        outrasDespesas: servico.outrasDespesas,
        desconto: servico.desconto,
        valorTotal: servico.valorTotal,
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
  vendaId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["servicos_venda", page]],
    () => getServicosVenda(page, vendaId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetServicoVendaResponse, unknown>;
}
