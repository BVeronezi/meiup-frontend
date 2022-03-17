import {
  Box,
  Button,
  createStandaloneToast,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import pt from "date-fns/locale/pt";
import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
registerLocale("pt", pt);

type FormData = {
  titulo: string;
  data: string;
  descricao: string;
};

const agendaFormSchema = yup.object().shape({
  titulo: yup.string(),
  descricao: yup.string(),
});

export default function DialogAgenda({ isOpen, onClose, slot }) {
  const toast = createStandaloneToast({ theme: customTheme });
  const [dataAgenda, setDataAgenda] = useState(new Date());
  const [descricao, setDescricao] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(agendaFormSchema),
  });

  const { errors } = formState;

  let handleDescricaoChange = (e) => {
    let inputValue = e.target.value;
    setDescricao(inputValue);
  };

  useEffect(() => {
    if (slot?.id) {
      setValue("titulo", slot.title);
      setDataAgenda(moment(slot.start).toDate());
      setDescricao(slot.descricao);
    } else {
      setDataAgenda(slot?.slots[0]);
    }
  }, [slot, setValue]);

  const handleAgenda: SubmitHandler<FormData> = async (values) => {
    const data = {
      titulo: values.titulo,
      data: dataAgenda,
      descricao: descricao,
    };

    try {
      if (slot?.id) {
        await api.patch(`/agenda/${slot?.id}`, {
          ...data,
        });
      } else {
        await api.post(`/agenda`, {
          ...data,
        });
      }

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      resetInputs();
      onClose(false);
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  async function handleDeleteAgenda() {
    try {
      setLoadingDelete(true);
      await api.delete(`/agenda/${slot?.id}`);

      toast({
        title: "Registro removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setLoadingDelete(false);
      resetInputs();
      onClose(true);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const resetInputs = () => {
    setValue("titulo", null);
    setDataAgenda(null);
    setDescricao(null);
  };

  const voltar = () => {
    resetInputs();
    onClose(true);
  };

  return (
    <Modal
      size="lg"
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agenda</ModalHeader>
        <ModalCloseButton />
        <Stack as="form" onSubmit={handleSubmit(handleAgenda)}>
          <ModalBody>
            <FormControl isInvalid={!!errors.titulo}>
              <Input
                name="titulo"
                autoFocus={true}
                placeholder="Adicionar título"
                error={errors.titulo}
                {...register("titulo")}
              ></Input>
            </FormControl>
            <Stack mt="10px" direction={["column", "row"]} spacing="24px">
              <Box w="200px">
                <DatePicker
                  locale="pt"
                  s
                  onChange={(date) => setDataAgenda(date)}
                  dateFormat="dd MMM, yyy h:mm"
                  showTimeSelect
                  selected={dataAgenda}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  customInput={<Input />}
                />
              </Box>
            </Stack>

            <Box mt="10px">
              <Textarea
                value={descricao}
                onChange={handleDescricaoChange}
                placeholder="Adicionar uma descrição"
                size="sm"
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              backgroundColor="red.700"
              fontSize={["14px", "16px"]}
              mr={3}
              onClick={voltar}
            >
              Voltar
            </Button>
            {slot?.id && (
              <Button
                mr={3}
                color="white"
                backgroundColor="red.500"
                fontSize={["14px", "16px"]}
                isLoading={loadingDelete}
                onClick={handleDeleteAgenda}
              >
                Remover
              </Button>
            )}

            <Button
              color="white"
              backgroundColor="blue.500"
              fontSize={["14px", "16px"]}
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Salvar
            </Button>
          </ModalFooter>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
