import { theme as customTheme } from "../../styles/theme";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import {
  Box,
  Input as ChakraInput,
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
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Input";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import axios from "axios";
import Insumos from "./insumos/insumos";
import { RiInformationLine } from "react-icons/ri";
import { api } from "../../services/apiClient";
import NumberFormat from "react-number-format";
import { LoadPage } from "../../components/Load";

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

export default function FormServico(produtos) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [stateNovoServico, setStateNovoServico] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const servicoId: any = Object.keys(router.query)[0];

  const [stateCusto, setStateCusto] = useState(0.0);
  const [stateValor, setStateValor] = useState(0.0);
  const [stateMargemLucro, setStateMargemLucro] = useState(0.0);

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(servicoFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findServico() {
      setIsLoading(true);

      if (servicoId) {
        const response: any = await api.get(`/servicos/${servicoId}`);

        const { nome, custo, valor, margemLucro } = response.data.servico;

        const regex = RegExp(
          "^[+-]?([0-9]{1,3}(,[0-9]{3})*(.[0-9]+)?|d*.d+|d+)$"
        );

        setValue("nome", nome);
        setStateCusto(Number(regex.exec(custo)) || custo);
        setStateValor(Number(regex.exec(valor)) || valor);
        setStateMargemLucro(Number(regex.exec(margemLucro)) || margemLucro);
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findServico();
    } else {
      setStateNovoServico(true);
    }

    focus();
  }, []);

  const handleLoad = (value) => {
    setIsLoadingFetch(value);
  };

  const handleServico: SubmitHandler<FormData> = async (values) => {
    const data = {
      usuario: user,
      empresa: user.empresa,
      nome: values.nome,
      custo: stateCusto,
      valor: stateValor,
      margemLucro: stateMargemLucro,
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
      console.log(err);
    }
  };

  return (
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
                <Tab>Serviço</Tab>
                <Tab isDisabled={stateNovoServico}>Insumos</Tab>
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
                          label="Nome: *"
                          error={errors.nome}
                          {...register("nome")}
                        ></Input>
                      </FormControl>
                      {!stateNovoServico && (
                        <Stack spacing="4">
                          <Text fontWeight="bold">Custo:</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <NumberFormat
                              value={stateCusto}
                              onValueChange={(val) =>
                                setStateCusto(val.floatValue)
                              }
                              customInput={ChakraInput}
                              variant="flushed"
                              borderColor="gray.400"
                              thousandSeparator="."
                              decimalSeparator=","
                              prefix={"R$"}
                            />
                          </Skeleton>
                        </Stack>
                      )}
                    </SimpleGrid>
                    {!stateNovoServico && (
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <Stack spacing="4">
                          <Text fontWeight="bold">Valor:</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <NumberFormat
                              value={stateValor}
                              onValueChange={(val) =>
                                setStateValor(val.floatValue)
                              }
                              customInput={ChakraInput}
                              variant="flushed"
                              borderColor="gray.400"
                              thousandSeparator="."
                              decimalSeparator=","
                              prefix={"R$"}
                            />
                          </Skeleton>
                        </Stack>
                        <Stack spacing="4">
                          <Text fontWeight="bold">Margem lucro:</Text>
                          <Skeleton isLoaded={!isLoading}>
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
                          </Skeleton>
                        </Stack>
                      </SimpleGrid>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Insumos produtos={produtos} handleLoad={handleLoad} />
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
                {stateNovoServico ? "CONTINUAR" : "SALVAR"}
              </Button>
            </HStack>
          </Box>
        </Stack>
      </Sidebar>
    </LoadPage>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["meiup.token"]: token } = parseCookies(ctx);

  const responseProdutos: any = await axios.get(
    `http://localhost:8000/api/v1/produtos`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const result = responseProdutos.data.found.produtos.map((e) => {
    return {
      value: String(e.id),
      label: e.descricao,
    };
  });

  return {
    props: {
      result,
    },
  };
};
