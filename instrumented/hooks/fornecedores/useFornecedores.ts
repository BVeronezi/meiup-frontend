import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";

type Fornecedor = {
  id: string;
  nome: string;
  email: string;
  celular: string;
  telefone: string;
};

type GetFornecedorResponse = {
  totalCount: number;
  fornecedores: Fornecedor[];
};

export async function getFornecedores(
  page: number,
  valuePesquisa?
): Promise<GetFornecedorResponse> {
  const response: any = await api.get(`/fornecedores`, {
    params: { page, nome: valuePesquisa },
  });

  const fornecedores = response.data.found.fornecedores.map((fornecedor) => {
    return {
      id: fornecedor.id,
      nome: fornecedor.nome,
      email: fornecedor.email,
      celular: fornecedor.celular,
      telefone: fornecedor.telefone,
    };
  });

  return {
    fornecedores,
    totalCount: response.data.found.total,
  };
}

export function useFornecedores(page: number, options?: UseQueryOptions) {
  return useQuery([["fornecedores", page]], () => getFornecedores(page), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetFornecedorResponse, unknown>;
}
