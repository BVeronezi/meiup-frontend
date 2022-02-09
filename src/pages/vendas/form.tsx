import Head from "next/head";
import {
  Box,
  Button,
  createStandaloneToast,
  FormControl,
  HStack,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { RiInformationLine } from "react-icons/ri";
import { api } from "../../services/apiClient";
import DatePicker from "react-datepicker";
import { theme as customTheme } from "../../styles/theme";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
import moment from "moment";
import ProdutoVenda from "./produto-venda/produto-venda";
import { Sidebar } from "../../components/Sidebar";
import ServicoVenda from "./servico-venda/servico-venda";
import { LoadPage } from "../../components/Load";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { InputCurrency } from "../../components/InputCurrency";
registerLocale("pt", pt);

type FormData = {
  usuario: string;
  dataVenda: string;
  cliente: number;
  email: string;
  celular: string;
  telefone: string;
  pagamento: string;
  troco: string;
  valorTotal: string;
};

const vendaFormSchema = yup.object().shape({
  dataVenda: yup.string(),
  cliente: yup.number(),
  email: yup.string(),
  celular: yup.string(),
  telefone: yup.string(),
  pagamento: yup.string(),
  troco: yup.string(),
  valorTotal: yup.string(),
});

export default function FormVendas() {
  const [venda, setVenda] = useState({ status: 0 });
  const [stateContinuarVenda, setStateContinuarVenda] = useState(true);
  const [stateNovaVenda, setStateNovaVenda] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const [date, setDate] = useState(moment().toDate());
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const vendaId: any = Object.keys(router.query)[0];

  const [pagamento, setPagamento] = useState(0);
  const [troco, setTroco] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(vendaFormSchema),
  });

  const { errors } = formState;

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o cliente",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  useEffect(() => {
    async function findVenda() {
      setIsLoading(true);

      if (vendaId) {
        const response: any = await api.get(`/vendas/${vendaId}`);
        setVenda((venda) => ({ ...venda, ...response.data.venda }));
        const { dataVenda, cliente, valorTotal, pagamento, troco } =
          response.data.venda;
        setDate(moment(dataVenda).toDate());
        const clienteOption: any = [response.data.venda.cliente].map((p) => {
          return { value: String(p.id), label: p.nome };
        })[0];
        setselectData(clienteOption);
        setValue("email", cliente.email);
        setValue("celular", cliente.celular);
        setValue("telefone", cliente.telefone);

        setPagamento(pagamento * 100);
        setTroco(troco * 100);
        setValorTotal(valorTotal * 100);
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findVenda();
    } else {
      setStateNovaVenda(true);
    }

    focus();
  }, []);

  async function callApi(value) {
    const { ["meiup.token"]: token } = parseCookies();

    const responseClientes: any = await axios.get(
      `https://meiup-api.herokuapp.com/api/v1/clientes`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, nome: value },
      }
    );

    const data = responseClientes.data.found.clientes.map((e) => {
      return { value: String(e.id), label: e.nome, email: e.email };
    });

    return data;
  }

  const handleLoad = (value) => {
    setIsLoadingFetch(value);
  };

  const handleVenda: SubmitHandler<FormData> = async (values) => {
    if (!selectData.value) {
      setStateContinuarVenda(false);
      return;
    }

    const data = {
      usuario: user,
      empresa: user.empresa,
      dataVenda: date,
      cliente: selectData.value,
      email: values.email,
      celular: values.celular,
      telefone: values.telefone,
      pagamento: pagamento / 100,
      troco: troco / 100,
      valorTotal: valorTotal / 100,
    };

    try {
      let resultVenda;

      if (vendaId) {
        await api.patch(`/vendas/${vendaId}`, {
          ...data,
        });
      } else {
        resultVenda = await api.post(`/vendas`, {
          ...data,
        });
      }

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (!stateNovaVenda) {
        router.back();
      } else {
        router.replace(`/vendas/form?${resultVenda?.data?.venda.id}`);
        setStateNovaVenda(false);
      }
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  async function finalizaVenda() {
    if (pagamento < valorTotal) {
      toast({
        title: "Valor do pagamento menor que o valor da venda!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    if (!pagamento) {
      toast({
        title: "Necessário informar pagamento para finalizar a venda!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    if (!valorTotal) {
      toast({
        title: "Venda sem valor!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    try {
      await api.patch(`/vendas/finaliza/${vendaId}`);

      toast({
        title: "Venda finalizada com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      router.back();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleCliente = (cliente) => {
    setValue("email", cliente.email);
    setValue("celular", cliente.celular);
    setValue("telefone", cliente.telefone);
    setStateContinuarVenda(true);
    setselectData(cliente);
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const calculaTroco = () => {
    let troco =
      (valorTotal ? valorTotal / 100 : 0) - (pagamento ? pagamento / 100 : 0);

    setTroco(troco * 100);
  };

  const handleValorVenda = (value) => {
    setValorTotal(value * 100);
  };

  return (
    <>
      <Head>
        <title>MEIUP | Venda</title>
      </Head>
      <LoadPage active={isLoadingFetch || isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleVenda)} flex="1">
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs
                isFitted
                variant="enclosed"
                index={tabIndex}
                onChange={handleTabsChange}
              >
                <TabList overflowX="auto">
                  <Tab data-cy="dados-basicos" fontWeight="bold">
                    Dados básicos
                  </Tab>
                  <Tab
                    data-cy="produtos"
                    fontWeight="bold"
                    isDisabled={stateNovaVenda}
                  >
                    Produtos
                  </Tab>
                  <Tab
                    data-cy="servicos"
                    fontWeight="bold"
                    isDisabled={stateNovaVenda}
                  >
                    Serviços
                  </Tab>
                  <Tab
                    data-cy="pagamento"
                    fontWeight="bold"
                    isDisabled={stateNovaVenda}
                  >
                    Pagamento
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {stateNovaVenda && (
                      <HStack>
                        <RiInformationLine />
                        <Text color="gray.900" fontSize="14px">
                          Necessário selecionar o cliente para prosseguir com a
                          venda!
                        </Text>
                      </HStack>
                    )}
                    <VStack marginTop="20px" spacing="12">
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <HStack alignSelf="normal">
                          <Text fontWeight="bold">Vendedor(a):</Text>
                          <Text data-cy="nome-vendedor">{user?.nome}</Text>
                        </HStack>
                        <Box>
                          <VStack align="left" spacing="4">
                            <Text fontWeight="bold">Data da venda *</Text>
                            <Skeleton isLoaded={!isLoading}>
                              <DatePicker
                                locale="pt"
                                dateFormat="dd MMMM, yyy"
                                showPopperArrow={false}
                                selected={date}
                                onChange={(date) => setDate(date)}
                                customInput={<Input />}
                              />
                            </Skeleton>
                          </VStack>
                        </Box>
                      </SimpleGrid>

                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Cliente *</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <AsyncSelect
                              id="cliente"
                              {...register("cliente")}
                              cacheOptions
                              loadOptions={callApi}
                              onChange={handleCliente}
                              value={selectData}
                              defaultOptions
                              loadingMessage={() => "Carregando..."}
                              noOptionsMessage={() =>
                                "Nenhum cliente encontrado"
                              }
                            />
                          </Skeleton>
                          {!stateContinuarVenda && (
                            <Text color="red" fontSize="14px">
                              Cliente obrigatório
                            </Text>
                          )}
                        </VStack>
                        <FormControl isInvalid={!!errors.email}>
                          <Input
                            isLoading={isLoading}
                            isDisabled={venda.status !== 0}
                            name="email"
                            label="Email "
                            error={errors.email}
                            {...register("email")}
                          ></Input>
                        </FormControl>
                      </SimpleGrid>
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <FormControl isInvalid={!!errors.celular}>
                          <Input
                            isLoading={isLoading}
                            isDisabled={venda.status !== 0}
                            name="celular"
                            label="Celular "
                            error={errors.celular}
                            {...register("celular")}
                          ></Input>
                        </FormControl>
                        <FormControl isInvalid={!!errors.telefone}>
                          <Input
                            isLoading={isLoading}
                            isDisabled={venda.status !== 0}
                            name="telefone"
                            label="Telefone "
                            error={errors.telefone}
                            {...register("telefone")}
                          ></Input>
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <ProdutoVenda
                      statusVenda={venda.status}
                      handleValorVenda={handleValorVenda}
                      isLoading={isLoading}
                      handleLoad={handleLoad}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ServicoVenda
                      statusVenda={venda.status}
                      handleValorVenda={handleValorVenda}
                      isLoading={isLoading}
                      handleLoad={handleLoad}
                    />
                  </TabPanel>
                  <TabPanel>
                    <VStack marginTop="14px" spacing="12">
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <InputCurrency
                          id="pagamento"
                          isDisabled={venda.status !== 0}
                          isLoading={isLoading}
                          name="pagamento"
                          label="Pagamento"
                          error={errors.pagamento}
                          {...register("pagamento")}
                          onBlur={calculaTroco}
                          value={pagamento}
                          onValueChange={(v) => {
                            setPagamento(v.floatValue);
                          }}
                        ></InputCurrency>

                        <InputCurrency
                          id="troco"
                          isReadOnly
                          isLoading={isLoading}
                          name="troco"
                          label="Troco"
                          error={errors.troco}
                          {...register("troco")}
                          value={troco}
                          onValueChange={(v) => {
                            setTroco(v.floatValue);
                          }}
                        ></InputCurrency>
                      </SimpleGrid>
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <InputCurrency
                          id="valorTotalVenda"
                          isReadOnly
                          isLoading={isLoading}
                          name="valorTotal"
                          label="Valor total"
                          error={errors.valorTotal}
                          {...register("valorTotal")}
                          value={valorTotal}
                          onValueChange={(v) => {
                            setValorTotal(v.floatValue);
                          }}
                        ></InputCurrency>
                        <Box></Box>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Box>
              <HStack spacing="24px" mt="10px" justify="flex-end">
                <Button
                  data-cy="voltar"
                  width={["150px", "200px"]}
                  type="submit"
                  color="white"
                  fontSize={["14px", "16px"]}
                  backgroundColor="red.700"
                  onClick={(event) => {
                    event.preventDefault();
                    router.back();
                  }}
                >
                  VOLTAR
                </Button>

                {venda.status === 0 && (
                  <Button
                    data-cy="salvar"
                    width={["150px", "200px"]}
                    fontSize={["14px", "16px"]}
                    type="submit"
                    color="white"
                    backgroundColor="blue.500"
                    isLoading={formState.isSubmitting}
                  >
                    {stateNovaVenda ? "CONTINUAR" : "SALVAR"}
                  </Button>
                )}

                {!stateNovaVenda && venda.status === 0 && (
                  <Button
                    data-cy="finalizar"
                    width={["150px", "200px"]}
                    fontSize={["14px", "16px"]}
                    type="submit"
                    color="white"
                    backgroundColor="teal.500"
                    onClick={(event) => {
                      event.preventDefault();
                      finalizaVenda();
                    }}
                  >
                    FINALIZAR
                  </Button>
                )}
              </HStack>
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
