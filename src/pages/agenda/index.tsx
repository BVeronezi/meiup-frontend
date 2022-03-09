import { Calendar, Event, momentLocalizer } from "react-big-calendar";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";

import moment from "moment";
import "moment/locale/pt-br";

const localizer = momentLocalizer(moment);

import "react-big-calendar/lib/css/react-big-calendar.css";
import DialogAgenda from "./form";
import { getAgenda, useAgenda } from "../../hooks/agenda/useAgenda";

const messages = {
  allDay: "Dia Inteiro",
  previous: "<",
  next: ">",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sem eventos cadastrados",
  showMore: (total) => `+ (${total}) Eventos`,
};

export default function Agenda() {
  const [isOpen, setIsOpen] = useState(false);
  const [slot, setIsSlot] = useState();
  const [events, setEvents] = useState([]);

  let { data, isLoading, error } = useAgenda({
    initialData: null,
  });

  useEffect(() => {
    setEvents(data?.agenda);
  }, [data]);

  const refresh = async () => {
    const response = await getAgenda();
    setEvents(response?.agenda);
  };

  const handleOpenDialog = (slot) => {
    setIsSlot(slot);
    setIsOpen(true);
    refresh();
  };

  const handleCloseDialog = (e) => {
    setIsOpen(false);
    refresh();
  };

  return (
    <Sidebar>
      <Calendar
        messages={messages}
        formats={{
          agendaDateFormat: "DD/MM ddd",
          weekdayFormat: "dddd",
        }}
        selectable={true}
        popup={true}
        onSelectSlot={handleOpenDialog}
        onSelectEvent={(slot) => handleOpenDialog(slot)}
        events={events}
        localizer={localizer}
        style={{ height: "100vh" }}
      />
      <DialogAgenda
        slot={slot}
        isOpen={isOpen}
        onClose={handleCloseDialog}
      ></DialogAgenda>
    </Sidebar>
  );
}
