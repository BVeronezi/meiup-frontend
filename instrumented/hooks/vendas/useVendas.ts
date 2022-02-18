import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Venda = {
  id: string;
  cliente: string;
  dataVenda: string;
  valorTotal: string;
  status: string;
};

type GetVendaResponse = {
  totalCount: number;
  vendas: Venda[];
};

export async function getVendas(
  page: number,
  valuePesquisa?
): Promise<GetVendaResponse> {
  const response: any = await api.get(`/vendas`, {
    params: { page, limit: 10, cliente: valuePesquisa },
  });

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const vendas = response.data.found.vendas.map((venda) => {
    return {
      id: venda.id,
      cliente: venda.cliente?.nome,
      dataVenda: new Date(venda.dataVenda).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }),
      valorTotal: formatter.format(
        venda.valorTotal ? Number(venda.valorTotal) : 0
      ),
      status: venda.status,
    };
  });

  return {
    vendas,
    totalCount: response.data.found.total,
  };
}

export function useVendas(page: number, options?: UseQueryOptions) {
  return useQuery([["vendas", page]], () => getVendas(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetVendaResponse, unknown>;
}
