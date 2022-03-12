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
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { Sidebar } from "../../components/Sidebar";
import { LoadPage } from "../../components/Load";
import { withSSRAuth } from "../../utils/withSSRAuth";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
import ProdutosPromocao from "./produtos/produtos";
import { RiInformationLine } from "react-icons/ri";
import ServicosPromocao from "./servicos/servicos";
registerLocale("pt", pt);

type FormData = {
  descricao: string;
  dataInicio: number;
  dataFim: number;
};

const promocaoFormSchema = yup.object().shape({
  descricao: yup.string().required("Descrição obrigatória"),
  dataInicio: yup.string(),
  dataFim: yup.string(),
});

export default function FormPromocao() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [stateNovaPromocao, setStateNovaPromocao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const [dataInicio, setDataInicio] = useState(moment().toDate());
  const [dataFim, setDataFim] = useState(moment().toDate());
  const promocaoId: any = Object.keys(router.query)[0];

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(promocaoFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findPromocao() {
      setIsLoading(true);

      if (promocaoId) {
        const response: any = await api.get(`/promocoes/${promocaoId}`);

        const { descricao, dataInicio, dataFim } = response.data.promocao;

        setValue("descricao", descricao);
        setDataInicio(moment(dataInicio).toDate());
        setDataFim(moment(dataFim).toDate());
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findPromocao();
    } else {
      setStateNovaPromocao(true);
    }

    focus();
  }, [promocaoId, router.query, setValue]);

  const handlePromocao: SubmitHandler<FormData> = async (values) => {
    const data = {
      usuario: user,
      empresa: user.empresa,
      descricao: values.descricao,
      dataInicio: dataInicio,
      dataFim: dataFim,
    };

    try {
      let resultServico;

      if (promocaoId) {
        await api.patch(`/promocoes/${promocaoId}`, {
          ...data,
        });
      } else {
        resultServico = await api.post(`/promocoes`, {
          ...data,
        });
      }

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (!stateNovaPromocao) {
        router.back();
      } else {
        router.replace(`/promocoes/form?${resultServico?.data?.promocao.id}`);
        setStateNovaPromocao(false);
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

  const handleLoad = (value) => {
    setIsLoadingFetch(value);
  };

  return (
    <>
      <Head>
        <title>MEIUP | Promoção</title>
      </Head>
      <LoadPage active={isLoading || isLoadingFetch}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handlePromocao)}>
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="promocao" fontWeight="bold">
                    Promoção
                  </Tab>
                  <Tab
                    isDisabled={stateNovaPromocao}
                    data-cy="produtos"
                    fontWeight="bold"
                  >
                    Produtos
                  </Tab>
                  <Tab
                    isDisabled={stateNovaPromocao}
                    data-cy="servicos"
                    fontWeight="bold"
                  >
                    Serviços
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {stateNovaPromocao && (
                      <HStack>
                        <RiInformationLine />
                        <Text color="gray.900" fontSize="14px">
                          Necessário informar a descrição da promoção e datas
                          para prosseguir com adição de produto e/ou serviços.
                        </Text>
                      </HStack>
                    )}
                    <VStack marginTop="20px" spacing="12">
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
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Data início *</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <DatePicker
                              locale="pt"
                              dateFormat="dd MMMM, yyy"
                              showPopperArrow={false}
                              selected={dataInicio}
                              onChange={(date) => setDataInicio(date)}
                              customInput={<Input />}
                            />
                          </Skeleton>
                        </VStack>
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Data fim *</Text>
                          <Skeleton isLoaded={!isLoading}>
                            <DatePicker
                              locale="pt"
                              dateFormat="dd MMMM, yyy"
                              showPopperArrow={false}
                              selected={dataFim}
                              onChange={(date) => setDataFim(date)}
                              customInput={<Input />}
                            />
                          </Skeleton>
                        </VStack>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <ProdutosPromocao
                      handleLoad={handleLoad}
                    ></ProdutosPromocao>
                  </TabPanel>
                  <TabPanel>
                    <ServicosPromocao
                      handleLoad={handleLoad}
                    ></ServicosPromocao>
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
                  {stateNovaPromocao ? "CONTINUAR" : "SALVAR"}
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
