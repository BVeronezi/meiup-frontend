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
  Input as InputChakra,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
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
import NumberFormat from "react-number-format";
registerLocale("pt", pt);

type FormData = {
  usuario: string;
  dataVenda: string;
  cliente: number;
  email: string;
  celular: string;
  telefone: string;
};

const vendaFormSchema = yup.object().shape({
  dataVenda: yup.string(),
  cliente: yup.number(),
  email: yup.string(),
  celular: yup.string(),
  telefone: yup.string(),
});

export default function FormVendas({ clientes, produtos, servicos }) {
  const [venda, setVenda] = useState({ status: 0 });
  const [stateCliente, setStateCliente] = useState("");
  const [stateContinuarVenda, setStateContinuarVenda] = useState(true);
  const [stateNovaVenda, setStateNovaVenda] = useState(false);
  const [statePagamento, setStatePagamento] = useState(0);
  const [stateTroco, setStateTroco] = useState(0);
  const [stateValorTotal, setStateValorTotal] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });
  const [date, setDate] = useState(moment().toDate());
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const vendaId: any = Object.keys(router.query)[0];

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(vendaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findVenda() {
      setIsLoading(false);

      if (vendaId) {
        const response: any = await api.get(`/vendas/${vendaId}`);
        setVenda((venda) => ({ ...venda, ...response.data.venda }));
        const { dataVenda, cliente, valorTotal, pagamento, troco } =
          response.data.venda;
        setDate(moment(dataVenda).toDate());
        setStateCliente(String(cliente.id));
        setValue("email", cliente.email);
        setValue("celular", cliente.celular);
        setValue("telefone", cliente.telefone);

        setStateValorTotal(valorTotal ? parseFloat(valorTotal) : 0);
        setStatePagamento(pagamento ? parseFloat(pagamento) : 0);
        setStateTroco(troco ? parseFloat(troco) : 0);
      }

      setIsLoading(true);
    }

    if (Object.keys(router.query)[0]) {
      findVenda();
    } else {
      setStateNovaVenda(true);
    }

    focus();
  }, []);

  const handleVenda: SubmitHandler<FormData> = async (values) => {
    if (!stateCliente) {
      setStateContinuarVenda(false);
      return;
    }

    const data = {
      usuario: user,
      empresa: user.empresa,
      dataVenda: date,
      cliente: stateCliente,
      email: values.email,
      celular: values.celular,
      telefone: values.telefone,
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
      console.log(err);
    }
  };

  async function finalizaVenda() {
    if (statePagamento < stateValorTotal) {
      toast({
        title: "Valor do pagamento menor que o valor da venda!",
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
      console.log(error);
    }
  }

  const handleCliente = (cliente) => {
    setValue("email", cliente.email);
    setValue("celular", cliente.celular);
    setValue("telefone", cliente.telefone);
    setStateContinuarVenda(true);
    setStateCliente(cliente.value);
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const handlePagamento = (value) => {
    setStatePagamento(value.floatValue);
    const troco = (value.floatValue ?? 0) - stateValorTotal;
    setStateTroco(troco);
  };

  const handleTroco = (value) => {
    setStateTroco(value.floatValue);
  };

  const handleValorVenda = (value) => {
    setStateValorTotal(value);
  };

  return (
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
              <Tab>Dados básicos</Tab>
              <Tab isDisabled={stateNovaVenda}>Produtos</Tab>
              <Tab isDisabled={stateNovaVenda}>Serviços</Tab>
              <Tab isDisabled={stateNovaVenda}>Pagamento</Tab>
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
                      <Text>{user?.nome}</Text>
                    </HStack>
                    <Box>
                      <VStack align="left" spacing="4">
                        <Text fontWeight="bold">Data da venda: *</Text>
                        <DatePicker
                          locale="pt"
                          dateFormat="dd MMMM, yyy"
                          showPopperArrow={false}
                          selected={date}
                          onChange={(date) => setDate(date)}
                          customInput={<Input />}
                        />
                      </VStack>
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <VStack align="left" spacing="4">
                      <Text fontWeight="bold">Cliente: *</Text>
                      <Select
                        isDisabled={venda.status !== 0}
                        id="cliente"
                        {...register("cliente")}
                        value={clientes.filter(function (option) {
                          return option.value === stateCliente;
                        })}
                        options={clientes}
                        onChange={handleCliente}
                        placeholder="Selecione o cliente *"
                      />
                      {!stateContinuarVenda && (
                        <Text color="red" fontSize="14px">
                          Cliente obrigatório
                        </Text>
                      )}
                    </VStack>
                    <FormControl isInvalid={!!errors.email}>
                      <Input
                        isDisabled={venda.status !== 0}
                        name="email"
                        label="Email: "
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
                        isDisabled={venda.status !== 0}
                        name="celular"
                        label="Celular: "
                        error={errors.celular}
                        {...register("celular")}
                      ></Input>
                    </FormControl>
                    <FormControl isInvalid={!!errors.telefone}>
                      <Input
                        isDisabled={venda.status !== 0}
                        name="telefone"
                        label="Telefone: "
                        error={errors.telefone}
                        {...register("telefone")}
                      ></Input>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
              <TabPanel>
                <ProdutoVenda
                  produtos={produtos}
                  statusVenda={venda.status}
                  handleValorVenda={handleValorVenda}
                />
              </TabPanel>
              <TabPanel>
                <ServicoVenda servicos={servicos} statusVenda={venda.status} />
              </TabPanel>
              <TabPanel>
                <VStack marginTop="14px" spacing="12">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Stack spacing="4">
                      <Text fontWeight="bold">Pagamento:</Text>
                      <NumberFormat
                        isDisabled={venda.status !== 0}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        value={statePagamento}
                        onValueChange={(val) => handlePagamento(val)}
                        customInput={InputChakra}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
                    <Stack spacing="4">
                      <Text fontWeight="bold">Troco:</Text>
                      <NumberFormat
                        isReadOnly={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        value={stateTroco}
                        onValueChange={(val) => handleTroco(val)}
                        customInput={InputChakra}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Stack spacing="4">
                      <Text fontWeight="bold">Valor total:</Text>
                      <NumberFormat
                        isReadOnly={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        value={stateValorTotal}
                        onValueChange={(val) =>
                          setStateValorTotal(val.floatValue)
                        }
                        customInput={InputChakra}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
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
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const responseClientes: any = await axios.get(
    `http://localhost:8000/api/v1/clientes`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const clientes = responseClientes.data.found.clientes.map((e) => {
    return { value: String(e.id), label: e.nome, email: e.email };
  });

  const responseServicos: any = await axios.get(
    `http://localhost:8000/api/v1/servicos`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const servicos = responseServicos.data.found.servicos.map((e) => {
    return {
      value: String(e.id),
      label: e.nome,
      valor: e.valor,
    };
  });

  const responseProdutos: any = await axios.get(
    `http://localhost:8000/api/v1/produtos`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const produtos = responseProdutos.data.found.produtos.map((e) => {
    return {
      value: String(e.id),
      label: e.descricao,
      precos: e.precos,
    };
  });

  return {
    props: {
      clientes,
      produtos,
      servicos,
    },
  };
};
