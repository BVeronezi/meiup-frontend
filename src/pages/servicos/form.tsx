import Head from "next/head";
import { theme as customTheme } from "../../styles/theme";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
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
} from "@chakra-ui/react";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Input";
import Insumos from "./insumos/insumos";
import { RiInformationLine } from "react-icons/ri";
import { api } from "../../services/apiClient";
import { LoadPage } from "../../components/Load";
import { InputCurrency } from "../../components/InputCurrency";
import { withSSRAuth } from "../../utils/withSSRAuth";

type FormData = {
  nome: string;
  custo: string;
  valor: string;
  margemLucro: string;
};

const servicoFormSchema = yup.object().shape({
  nome: yup.string().required("Nome obrigatório"),
  custo: yup.string(),
  valor: yup.string(),
  margemLucro: yup.string(),
});

export default function FormServico() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [stateNovoServico, setStateNovoServico] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [valor, setValor] = useState(0);
  const [custo, setCusto] = useState(0);
  const [margemLucro, setMargemLucro] = useState(0);
  const toast = createStandaloneToast({ theme: customTheme });
  const servicoId: any = Object.keys(router.query)[0];

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(servicoFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findServico() {
      setIsLoading(true);

      if (servicoId) {
        const response: any = await api.get(`/servicos/${servicoId}`);

        const { nome, custo, valor, margemLucro } = response.data.servico;

        setValue("nome", nome);
        setValor(valor * 100);
        setCusto(custo * 100);
        setMargemLucro(margemLucro * 100);
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findServico();
    } else {
      setStateNovoServico(true);
    }

    focus();
  }, [servicoId, router.query, setValue]);

  const handleLoad = (value) => {
    setIsLoadingFetch(value);
  };

  const handleServico: SubmitHandler<FormData> = async (values) => {
    const data = {
      usuario: user,
      empresa: user.empresa,
      nome: values.nome,
      custo: custo / 100,
      valor: valor / 100,
      margemLucro: margemLucro / 100,
    };

    try {
      let resultServico;

      if (servicoId) {
        await api.patch(`/servicos/${servicoId}`, {
          ...data,
        });
      } else {
        resultServico = await api.post(`/servicos`, {
          ...data,
        });
      }

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (!stateNovoServico) {
        router.back();
      } else {
        router.replace(`/servicos/form?${resultServico?.data?.servico.id}`);
        setStateNovoServico(false);
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

  const calculaMargemLucro = () => {
    let resultMargemLucro =
      ((valor ? valor / 100 : 0) - (custo ? custo / 100 : 0)) * 100;

    setMargemLucro(resultMargemLucro);
  };

  return (
    <>
      <Head>
        <title>MEIUP | Serviço</title>
      </Head>
      <LoadPage active={isLoading || isLoadingFetch}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleServico)}>
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="servico" fontWeight="bold">
                    Serviço
                  </Tab>
                  <Tab
                    data-cy="insumos"
                    isDisabled={stateNovoServico}
                    fontWeight="bold"
                  >
                    Insumos
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {stateNovoServico && (
                      <HStack>
                        <RiInformationLine />
                        <Text color="gray.900" fontSize="14px">
                          Necessário informar o nome do serviço para prosseguir
                          com valores e adição de insumos.
                        </Text>
                      </HStack>
                    )}
                    <VStack marginTop="14px" spacing="12">
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <FormControl isInvalid={!!errors.nome}>
                          <Input
                            isLoading={isLoading}
                            name="nome"
                            autoFocus={true}
                            label="Nome *"
                            error={errors.nome}
                            {...register("nome")}
                          ></Input>
                        </FormControl>
                        {!stateNovoServico && (
                          <InputCurrency
                            id="valor"
                            isLoading={isLoading}
                            name="valor"
                            label="Valor"
                            error={errors.valor}
                            {...register("valor")}
                            onBlur={calculaMargemLucro}
                            value={valor}
                            onValueChange={(v) => {
                              setValor(v.floatValue);
                            }}
                          ></InputCurrency>
                        )}
                      </SimpleGrid>
                      {!stateNovoServico && (
                        <SimpleGrid
                          minChildWidth="240px"
                          spacing={["6", "8"]}
                          w="100%"
                        >
                          <InputCurrency
                            id="custo"
                            isLoading={isLoading}
                            name="custo"
                            label="Custo"
                            error={errors.custo}
                            {...register("custo")}
                            onBlur={calculaMargemLucro}
                            value={custo}
                            onValueChange={(v) => {
                              setCusto(v.floatValue);
                            }}
                          ></InputCurrency>
                          <InputCurrency
                            id="margemLucro"
                            isDisabled={true}
                            isLoading={isLoading}
                            name="margemLucro"
                            label="Margem lucro"
                            error={errors.margemLucro}
                            {...register("margemLucro")}
                            value={margemLucro}
                            onValueChange={(v) => {
                              setMargemLucro(v.floatValue);
                            }}
                          ></InputCurrency>
                        </SimpleGrid>
                      )}
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Insumos handleLoad={handleLoad} />
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
                  {stateNovoServico ? "CONTINUAR" : "SALVAR"}
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
