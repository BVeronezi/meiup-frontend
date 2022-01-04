import {
  Box,
  Input as ChakraInput,
  Button,
  createStandaloneToast,
  FormControl,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { theme as customTheme } from "../../styles/theme";
import * as yup from "yup";
import Select from "react-select";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { ContainerPage } from "../../components/ContainerPage";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import NumberFormat from "react-number-format";

type FormData = {
  descricao: string;
  tipoItem: number;
  unidade: number;
  categoria: number;
  estoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  precoVendaVarejo: number;
  precoVendaAtacado: number;
  precoCompra: number;
  margemLucro: number;
};

const produtoFormSchema = yup.object().shape({
  descricao: yup.string().required("Descrição obrigatória"),
  tipoItem: yup.number(),
  unidade: yup.number(),
  categoria: yup.number(),
  estoque: yup.string().required("Estoque obrigatório"),
  estoqueMinimo: yup.string(),
  estoqueMaximo: yup.string(),
});

export default function FormProduto(optionsCategoria) {
  const [stateTipoItem, setStateTipoItem] = useState("");
  const [stateUnidade, setStateUnidade] = useState("");
  const [stateCategoria, setStateCategoria] = useState("");
  const [statePrecoVendaVarejo, setStatePrecoVendaVarejo] = useState(0.0);
  const [statePrecoVendaAtacado, setStatePrecoVendaAtacado] = useState(0.0);
  const [statePrecoCompra, setStatePrecoCompra] = useState(0.0);
  const [stateMargemLucro, setStateMargemLucro] = useState(0.0);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(produtoFormSchema),
  });

  const { errors } = formState;

  const optionsTipoItem = [
    { value: "1", label: "Produto" },
    { value: "2", label: "Insumo" },
    { value: "3", label: "Kit" },
    { value: "4", label: "Brinde" },
  ];

  const optionsUnidade = [
    { value: "1", label: "Quilograma" },
    { value: "2", label: "Caixa" },
    { value: "3", label: "Fardo" },
  ];

  useEffect(() => {
    async function findProduto() {
      setIsLoading(false);

      const produtoId: any = Object.keys(router.query)[0];

      if (produtoId) {
        const response: any = await api.get(`/produtos/${produtoId}`);

        const {
          descricao,
          estoque,
          estoqueMinimo,
          estoqueMaximo,
          empresa,
          tipoItem,
          unidade,
        } = response.data.produto;

        setValue("descricao", descricao);
        setValue("estoque", estoque);
        setValue("estoqueMinimo", estoqueMinimo);
        setValue("estoqueMaximo", estoqueMaximo);
        setValue("empresa", empresa?.id);

        setStateTipoItem(String(tipoItem));
        setStateUnidade(String(unidade));

        if (response.data.produto.precos) {
          const regex = RegExp(
            "^[+-]?([0-9]{1,3}(,[0-9]{3})*(.[0-9]+)?|d*.d+|d+)$"
          );
          const {
            precoVendaVarejo,
            precoVendaAtacado,
            precoCompra,
            margemLucro,
          } = response.data.produto.precos;

          setStatePrecoVendaVarejo(Number(regex.exec(precoVendaVarejo)?.input));
          setStatePrecoVendaAtacado(
            Number(regex.exec(precoVendaAtacado)?.input)
          );
          setStatePrecoCompra(Number(regex.exec(precoCompra)?.input));
          setStateMargemLucro(Number(regex.exec(margemLucro)?.input));
        }

        if (response.data.produto.categoria) {
          const { id } = response.data.produto.categoria;
          setStateCategoria(String(id));
        }
      }

      setIsLoading(true);
    }

    if (Object.keys(router.query)[0]) {
      findProduto();
    }

    focus();
  }, []);

  const handleTipoItem = (tipoItem) => {
    setStateTipoItem(tipoItem.value);
  };

  const handleUnidade = (unidade) => {
    setStateUnidade(unidade.value);
  };

  const handleCategoria = (categoria) => {
    setStateCategoria(categoria.value);
  };

  const handleProduto: SubmitHandler<FormData> = async (values) => {
    const data = {
      descricao: values.descricao,
      tipoItem: Number(stateTipoItem),
      unidade: Number(stateUnidade),
      categoria: Number(stateCategoria),
      estoque: Number(values.estoque),
      estoqueMinimo: Number(values.estoqueMinimo),
      estoqueMaximo: Number(values.estoqueMaximo),
      empresa: user.empresa,
      precos: {
        precoVendaVarejo: Number(statePrecoVendaVarejo),
        precoVendaAtacado: Number(statePrecoVendaAtacado),
        precoCompra: Number(statePrecoCompra),
        margemLucro: Number(stateMargemLucro),
      },
    };

    try {
      const produtoId: any = Object.keys(router.query)[0];

      if (produtoId) {
        await api.patch(`/produtos/${produtoId}`, {
          ...data,
        });
      } else {
        await api.post(`/produtos`, {
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
      console.log(err);
    }
  };

  return (
    <ContainerPage title="Produto" subtitle="Novo Produto">
      <Stack as="form" onSubmit={handleSubmit(handleProduto)} flex="1">
        <Box
          borderBottom="1px"
          borderLeft="1px"
          borderRight="1px"
          borderRadius="lg"
          borderColor="gray.300"
        >
          <Tabs isFitted variant="enclosed">
            <TabList>
              <Tab>Dados básicos</Tab>
              <Tab>Estoque</Tab>
              <Tab>Preços</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack marginTop="14px" spacing="12">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <FormControl isInvalid={!!errors.descricao}>
                      <Input
                        name="descricao"
                        autoFocus={true}
                        label="Descrição *:"
                        error={errors.descricao}
                        {...register("descricao")}
                      ></Input>
                    </FormControl>
                    <VStack align="left" spacing="4">
                      <Text>Tipo Item:</Text>
                      <Select
                        {...register("tipoItem")}
                        value={optionsTipoItem.filter(function (option) {
                          return option.value === stateTipoItem;
                        })}
                        id="tipoItem"
                        options={optionsTipoItem}
                        onChange={(value) => handleTipoItem(value)}
                        placeholder="Selecione o tipo do item"
                      />
                    </VStack>
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <VStack align="left" spacing="4">
                      <Text>Unidade:</Text>
                      <Select
                        {...register("unidade")}
                        value={optionsUnidade.filter(function (option) {
                          return option.value === stateUnidade;
                        })}
                        id="unidade"
                        options={optionsUnidade}
                        onChange={handleUnidade}
                        placeholder="Selecione a unidade"
                      />
                    </VStack>
                    <VStack align="left" spacing="4">
                      <Text>Categoria:</Text>
                      <Select
                        id="categoria"
                        {...register("categoria")}
                        value={optionsCategoria.result.filter(function (
                          option
                        ) {
                          return option.value === stateCategoria;
                        })}
                        options={optionsCategoria.result}
                        onChange={handleCategoria}
                        placeholder="Selecione a categoria"
                      />
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack marginTop="14px" spacing="12">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <FormControl isInvalid={!!errors.estoque}>
                      <Input
                        type="number"
                        name="estoque"
                        label="Estoque *:"
                        error={errors.estoque}
                        {...register("estoque")}
                      ></Input>
                    </FormControl>
                    <Input
                      type="number"
                      name="estoqueMinimo"
                      label="Estoque Mínimo:"
                      error={errors.estoqueMinimo}
                      {...register("estoqueMinimo")}
                    ></Input>
                    <Input
                      type="number"
                      name="estoqueMaximo"
                      label="Estoque Máximo:"
                      error={errors.estoqueMaximo}
                      {...register("estoqueMaximo")}
                    ></Input>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack marginTop="14px" spacing="12">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Stack spacing="4">
                      <Text>Preço de venda varejo:</Text>
                      <NumberFormat
                        value={statePrecoVendaVarejo}
                        onValueChange={(val) =>
                          setStatePrecoVendaVarejo(val.floatValue)
                        }
                        customInput={ChakraInput}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
                    <Stack spacing="4">
                      <Text>Preço de venda atacado:</Text>
                      <NumberFormat
                        value={statePrecoVendaAtacado}
                        onValueChange={(val) =>
                          setStatePrecoVendaAtacado(val.floatValue)
                        }
                        customInput={ChakraInput}
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
                      <Text>Preço de compra:</Text>
                      <NumberFormat
                        value={statePrecoCompra}
                        onValueChange={(val) =>
                          setStatePrecoCompra(val.floatValue)
                        }
                        customInput={ChakraInput}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
                    <Stack spacing="4">
                      <Text>Margem de lucro:</Text>
                      <NumberFormat
                        value={stateMargemLucro}
                        onValueChange={(val) =>
                          setStateMargemLucro(val.floatValue)
                        }
                        customInput={ChakraInput}
                        variant="flushed"
                        borderColor="gray.400"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"R$"}
                      />
                    </Stack>
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

            <Button
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
        </Box>
      </Stack>
    </ContainerPage>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const response: any = await axios.get(
    `http://localhost:8000/api/v1/categorias`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const result = response.data.found.categorias.map((e) => {
    return { value: String(e.id), label: e.nome };
  });

  return {
    props: {
      result,
    },
  };
};
