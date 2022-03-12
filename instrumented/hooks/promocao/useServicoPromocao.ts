import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type ServicoPromocao = {
  id: string;
  servico: any;
  precoPromocional: number;
};

type GetServicoPromocaoResponse = {
  totalCount: number;
  servicosPromocao: ServicoPromocao[];
};

export async function getServicoPromocao(
  page: number,
  promocaoId?
): Promise<GetServicoPromocaoResponse> {
  const response: any = await api.get(`/servicosPromocao`, {
    params: { promocaoId, page, limit: 10 },
  });

  const servicosPromocao = response.data.found.servicosPromocao.map((p) => {
    return {
      id: p.id,
      servico: p.servico,
      precoPromocional: p.precoPromocional,
    };
  });

  return {
    servicosPromocao,
    totalCount: response.data.found.total,
  };
}

export function useServicosPromocao(
  page: number,
  promocaoId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    [["servicos_promocao", page]],
    () => getServicoPromocao(page, promocaoId),
    {
      staleTime: 0,
      ...options,
    }
  ) as UseQueryResult<GetServicoPromocaoResponse, unknown>;
}
