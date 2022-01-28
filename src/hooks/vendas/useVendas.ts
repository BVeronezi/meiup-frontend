import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

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
  ctx,
  valuePesquisa?
): Promise<GetVendaResponse> {
  const { ["meiup.token"]: token } = parseCookies(ctx);
  const { ["meiup.empresa"]: empresa } = parseCookies(ctx);

  const response: any = await axios.get(`http://localhost:8000/api/v1/vendas`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, empresa, limit: 10, cliente: valuePesquisa },
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

export function useVendas(
  page: number,
  ctx = undefined,
  options?: UseQueryOptions
) {
  return useQuery([["vendas", page]], () => getVendas(page, ctx), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetVendaResponse, unknown>;
}
