import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Servico = {
  id: string;
  nome: string;
  custo: number;
  valor: number;
  margemLucro: number;
};

type GetServicoResponse = {
  totalCount: number;
  servicos: Servico[];
};

export async function getServicos(
  page: number,
  valuePesquisa?
): Promise<GetServicoResponse> {
  const response: any = await api.get(`/servicos`, {
    params: { page, nome: valuePesquisa },
  });

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const servicos = response.data.found.servicos.map((servico) => {
    return {
      id: servico.id,
      nome: servico.nome,
      custo: formatter.format(servico.custo ? Number(servico.custo) : 0),
      valor: formatter.format(servico.valor ? Number(servico.valor) : 0),
      margemLucro: formatter.format(
        servico.margemLucro ? Number(servico.margemLucro) : 0
      ),
    };
  });

  return {
    servicos,
    totalCount: response.data.found.total,
  };
}

export function useServicos(page: number, options?: UseQueryOptions) {
  return useQuery([["servicos", page]], () => getServicos(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetServicoResponse, unknown>;
}
