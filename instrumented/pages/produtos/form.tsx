import Head from "next/head";
import {
  Box,
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
  Skeleton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { theme as customTheme } from "../../styles/theme";
import * as yup from "yup";
import Select from "react-select";
import AsyncSelect from "react-select/async";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { Sidebar } from "../../components/Sidebar";
import { LoadPage } from "../../components/Load";
import { InputCurrency } from "../../components/InputCurrency";
import { withSSRAuth } from "../../utils/withSSRAuth";

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

export default function FormProduto() {
  const [stateTipoItem, setStateTipoItem] = useState("");
  const [stateUnidade, setStateUnidade] = useState("");
  const [precoVarejo, setPrecoVarejo] = useState(0);
  const [precoAtacado, setPrecoAtacado] = useState(0);
  const [precoCompra, setPrecoCompra] = useState(0);
  const [margemLucro, setMargemLucro] = useState(0);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
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
    { value: "4", label: "Bandeja" },
    { value: "5", label: "Unidade" },
  ];

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione a categoria",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  useEffect(() => {
    async function findProduto() {
      setIsLoading(true);

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
          const {
            precoVendaVarejo,
            precoVendaAtacado,
            precoCompra,
            margemLucro,
          } = response.data.produto.precos;
          setPrecoVarejo(precoVendaVarejo * 100);
          setPrecoAtacado(precoVendaAtacado * 100);
          setPrecoCompra(precoCompra * 100);
          setMargemLucro(margemLucro * 100);
        }

        if (response.data.produto.categoria) {
          const categoria: any = [response.data.produto.categoria].map((p) => {
            return { value: String(p.id), label: p.nome };
          })[0];
          setselectData(categoria);
        }
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findProduto();
    }

    focus();
  }, []);

  async function callApi(value) {
    const response: any = await api.get(`/categorias`, {
      params: { limit: 10, nome: value },
    });

    const data = response.data.found.categorias.map((e) => {
      return { value: String(e.id), label: e.nome };
    });

    return data;
  }

  const handleTipoItem = (tipoItem) => {
    setStateTipoItem(tipoItem.value);
  };

  const handleUnidade = (unidade) => {
    setStateUnidade(unidade.value);
  };

  const handleCategoria = (categoria) => {
    setselectData(categoria);
  };

  const calculaMargemLucro = () => {
    const precoVenda = precoVarejo ? precoVarejo / 100 : precoAtacado / 100;

    let resultMargemLucro =
      ((precoVenda ? precoVenda : 0) - (precoCompra ? precoCompra / 100 : 0)) *
      100;

    setMargemLucro(resultMargemLucro);
  };

  const handleProduto: SubmitHandler<FormData> = async (values) => {
    const data = {
      descricao: values.descricao,
      tipoItem: Number(stateTipoItem),
      unidade: Number(stateUnidade),
      categoria: selectData.value,
      estoque: Number(values.estoque),
      estoqueMinimo: Number(values.estoqueMinimo),
      estoqueMaximo: Number(values.estoqueMaximo),
      empresa: user.empresa,
      precos: {
        precoVendaVarejo: precoVarejo / 100,
        precoVendaAtacado: precoAtacado / 100,
        precoCompra: precoCompra / 100,
        margemLucro: margemLucro / 100,
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
        <title>MEIUP | Produto</title>
      </Head>
      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleProduto)}>
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="produto" fontWeight="bold">
                    Produto
                  </Tab>
                  <Tab data-cy="estoque" fontWeight="bold">
                    Estoque
                  </Tab>
                  <Tab data-cy="precos" fontWeight="bold">
                    Preços
                  </Tab>
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
                            isLoading={isLoading}
                            name="descricao"
                            autoFocus={true}
                            label="Descrição *"
                            error={errors.descricao}
                            {...register("descricao")}
                          ></Input>
                        </FormControl>
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Tipo Item</Text>
                          <Skeleton isLoaded={!isLoading}>
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
                          </Skeleton>
                        </VStack>
                      </SimpleGrid>
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Unidade</Text>
                          <Skeleton isLoaded={!isLoading}>
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
                          </Skeleton>
                        </VStack>
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Categoria</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <AsyncSelect
                              id="categoria"
                              {...register("categoria")}
                              cacheOptions
                              loadOptions={callApi}
                              onChange={handleCategoria}
                              value={selectData}
                              defaultOptions
                              loadingMessage={() => "Carregando..."}
                              noOptionsMessage={() =>
                                "Nenhuma categoria encontrada"
                              }
                            />
                          </Skeleton>
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
                            isLoading={isLoading}
                            type="number"
                            name="estoque"
                            label="Estoque *"
                            error={errors.estoque}
                            {...register("estoque")}
                          ></Input>
                        </FormControl>
                        <Input
                          isLoading={isLoading}
                          type="number"
                          name="estoqueMinimo"
                          label="Estoque Mínimo"
                          error={errors.estoqueMinimo}
                          {...register("estoqueMinimo")}
                        ></Input>
                        <Input
                          isLoading={isLoading}
                          type="number"
                          name="estoqueMaximo"
                          label="Estoque Máximo"
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
                        <InputCurrency
                          id="precoVendaVarejo"
                          isLoading={isLoading}
                          name="precoVendaVarejo"
                          label="Preço de venda varejo"
                          error={errors.precoVendaVarejo}
                          {...register("precoVendaVarejo")}
                          onBlur={calculaMargemLucro}
                          value={precoVarejo}
                          onValueChange={(v) => {
                            setPrecoVarejo(v.floatValue);
                          }}
                        ></InputCurrency>

                        <InputCurrency
                          id="precoVendaAtacado"
                          isLoading={isLoading}
                          name="precoVendaAtacado"
                          label="Preço de venda atacado"
                          error={errors.precoVendaAtacado}
                          {...register("precoVendaAtacado")}
                          onBlur={calculaMargemLucro}
                          value={precoAtacado}
                          onValueChange={(v) => setPrecoAtacado(v.floatValue)}
                        ></InputCurrency>
                      </SimpleGrid>
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <InputCurrency
                          id="precoCompra"
                          isLoading={isLoading}
                          name="precoCompra"
                          label="Preço de compra"
                          error={errors.precoCompra}
                          {...register("precoCompra")}
                          onBlur={calculaMargemLucro}
                          value={precoCompra}
                          onValueChange={(v) => setPrecoCompra(v.floatValue)}
                        ></InputCurrency>
                        <InputCurrency
                          id="margemLucro"
                          isDisabled={true}
                          isLoading={isLoading}
                          name="margemLucro"
                          label="Margem de lucro"
                          error={errors.margemLucro}
                          {...register("margemLucro")}
                          value={margemLucro}
                        ></InputCurrency>
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
