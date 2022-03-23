import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../../services/apiClient";
import moment from "moment";

type Agenda = {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
};

type GetAgendaResponse = {
  totalCount: number;
  agenda: Agenda[];
};

export async function getAgenda(valuePesquisa?): Promise<GetAgendaResponse> {
  const response: any = await api.get(`/agenda`, {
    params: { nome: valuePesquisa },
  });

  const agenda = response.data.found.agenda.map((agenda) => {
    return {
      id: agenda.id,
      title: agenda.titulo,
      start: moment(agenda.data).toDate(),
      end: moment(agenda.data).toDate(),
      descricao: agenda.descricao,
    };
  });

  return {
    agenda,
    totalCount: response.data.found.total,
  };
}

export function useAgenda(options?: UseQueryOptions) {
  return useQuery([["agenda"]], () => getAgenda(), {
    staleTime: 0,
    ...options,
  }) as UseQueryResult<GetAgendaResponse, unknown>;
}
