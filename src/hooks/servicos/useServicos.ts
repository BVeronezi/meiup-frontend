import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  valuePesquisa?
): Promise<GetServicoResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/servicos`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, empresa, nome: valuePesquisa },
    }
  );

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

export function useServicos(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["servicos", page]], () => getServicos(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetServicoResponse, unknown>;
}
