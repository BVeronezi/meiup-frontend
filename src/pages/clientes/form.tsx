import Head from "next/head";
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as yup from "yup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { useContext, useEffect, useState } from "react";
import { theme as customTheme } from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../services/apiClient";
import axios from "axios";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { LoadPage } from "../../components/Load";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Input";
import { Endereco } from "../../fragments/endereco";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import pt from "date-fns/locale/pt";
registerLocale("pt", pt);

type FormData = {
  nome: string;
  email: string;
  dataNascimento: string;
  telefone: number;
  celular: number;
  cep: number;
  endereco: string;
  estado: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
};

const usuarioFormSchema = yup.object().shape({
  nome: yup.string().required("Nome obrigatório"),
  email: yup.string(),
  telefone: yup.string(),
  celular: yup.string(),
  cep: yup.string(),
  endereco: yup.string(),
});

export default function FormUsuario() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState();
  const toast = createStandaloneToast({ theme: customTheme });
  const clienteId: any = Object.keys(router.query)[0];
  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(usuarioFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findCliente() {
      setIsLoading(true);

      if (clienteId) {
        const response: any = await api.get(`/clientes/${clienteId}`);

        Object.entries(response.data.cliente).forEach(([key, value]) => {
          if (key !== "endereco") {
            setValue(key, value);
          }
        });

        if (response.data.cliente.endereco) {
          Object.entries(response.data.cliente.endereco).forEach(
            ([key, value]) => {
              setValue(key, value);
            }
          );
        }
      }

      setIsLoading(false);
    }

    if (clienteId) {
      findCliente();
    }
    focus();
  }, []);

  const buscaCep = async (value) => {
    const cep = value.replace(/[^0-9]/g, "");

    if (cep.length === 8) {
      try {
        const resultEndereco: any = await axios.get(
          `https://api.cnpja.com.br/zip/${cep}`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_KEY_CEP,
            },
          }
        );

        if (resultEndereco.data) {
          const { zip, street, district, city, state } = resultEndereco.data;

          setValue("cep", zip);
          setValue("endereco", street);
          setValue("numero", "");
          setValue("bairro", district);
          setValue("cidade", city);
          setValue("estado", state);
          setValue("complemento", "");
        }
      } catch (error) {
        toast({
          title: "CEP não encontrado",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleUsuario: SubmitHandler<FormData> = async (values) => {
    const data = {
      nome: values.nome,
      email: values.email,
      dataNascimento: date,
      telefone: values.telefone,
      celular: values.celular,
      empresa: user.empresa,
      endereco: {
        cep: values.cep,
        endereco: values.endereco,
        numero: values.numero,
        bairro: values.bairro,
        cidade: values.cidade,
        estado: values.estado,
        complemento: values.complemento,
      },
    };

    try {
      if (clienteId) {
        await api.patch(`/clientes/${clienteId}`, {
          ...data,
        });
      } else {
        await api.post(`/clientes`, {
          ...data,
        });
      }

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      router.back();
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>MEIUP | Cliente</title>
      </Head>
      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleUsuario)} flex="1">
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="dados-basicos" fontWeight="bold">Dados básicos</Tab>
                  <Tab data-cy="endereco" fontWeight="bold">Endereço</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack marginTop="14px" spacing="12">
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <Input
                          isLoading={isLoading}
                          name="nome"
                          autoFocus={true}
                          label="Nome *"
                          error={errors.nome}
                          {...register("nome")}
                        ></Input>

                        <Input
                          isLoading={isLoading}
                          name="email"
                          type="email"
                          label="E-mail"
                          error={errors.email}
                          {...register("email")}
                        ></Input>
                      </SimpleGrid>
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <Input
                          isLoading={isLoading}
                          name="celular"
                          label="Celular"
                          {...register("celular")}
                        ></Input>
                        <Input
                          isLoading={isLoading}
                          name="telefone"
                          label="Telefone"
                          {...register("telefone")}
                        ></Input>
                        <Box>
                          <VStack align="left" spacing="4">
                            <Text fontWeight="bold">Data nascimento</Text>
                            <Skeleton isLoaded={!isLoading}>
                              <DatePicker
                                locale="pt"
                                dateFormat="dd MMMM, yyy"
                                showPopperArrow={false}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                customInput={<Input />}
                              />
                            </Skeleton>
                          </VStack>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Endereco
                      register={register}
                      errors={errors}
                      isLoading={isLoading}
                      buscaCep={buscaCep}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Box>
              <Flex mt="8" justify="flex-end">
                <HStack spacing="24px">
                  <Button
                    data-cy="voltar"
                    width={["150px", "200px"]}
                    fontSize={["14px", "16px"]}
                    type="submit"
                    color="white"
                    backgroundColor="red.700"
                    onClick={(event) => {
                      event.preventDefault();
                      router.back();
                    }}
                  >
                    VOLTAR
                  </Button>
                  <Button
                    data-cy="salvar"
                    width={["150px", "200px"]}
                    fontSize={["14px", "16px"]}
                    type="submit"
                    color="white"
                    backgroundColor="blue.500"
                    isLoading={formState.isSubmitting}
                  >
                    SALVAR
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </Stack>
        </Sidebar>
      </LoadPage>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
