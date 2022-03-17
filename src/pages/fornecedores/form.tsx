import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { LoadPage } from "../../components/Load";
import { Sidebar } from "../../components/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { Endereco } from "../../fragments/endereco";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
import { withSSRAuth } from "../../utils/withSSRAuth";

type FormData = {
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone: number;
  celular: number;
  situacaoCadastral: string;
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

export default function FormFornecedor() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const fornecedorId: any = Object.keys(router.query)[0];
  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(usuarioFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findFornecedor() {
      setIsLoading(true);

      if (fornecedorId) {
        const response: any = await api.get(`/fornecedores/${fornecedorId}`);

        Object.entries(response.data.fornecedor).forEach(([key, value]) => {
          if (key !== "endereco") {
            setValue(key, value);
          }
        });

        if (response.data.fornecedor.endereco) {
          Object.entries(response.data.fornecedor.endereco).forEach(
            ([key, value]) => {
              setValue(key, value);
            }
          );
        }
      }

      setIsLoading(false);
    }

    if (fornecedorId) {
      findFornecedor();
    }
    focus();
  }, [fornecedorId, setValue]);

  const buscaCep = async (value) => {
    const cep = value.replace(/[^0-9]/g, "");

    if (cep.length === 8) {
      try {
        const resultEndereco: any = await axios.get(
          `https://api.cnpja.com.br/zip/${cep}`,
          {
            headers: {
              Authorization:
                "d7756953-d64d-46a3-8a7f-ffb409dd20a0-38e52cca-6626-41e9-950b-f69496b95a0a",
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

  const handleFornecedor: SubmitHandler<FormData> = async (values) => {
    const data = {
      nome: values.nome,
      email: values.email,
      cpfCnpj: values.cpfCnpj,
      telefone: values.telefone,
      celular: values.celular,
      situacaoCadastral: values.situacaoCadastral,
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
      if (fornecedorId) {
        await api.patch(`/fornecedores/${fornecedorId}`, {
          ...data,
        });
      } else {
        await api.post(`/fornecedores`, {
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
        <title>MEIUP | Fornecedor</title>
      </Head>
      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleFornecedor)} flex="1">
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="dados-basicos" fontWeight="bold">
                    Dados básicos
                  </Tab>
                  <Tab data-cy="endereco" fontWeight="bold">
                    Endereço
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
                          name="cpfCnpj"
                          autoFocus={true}
                          label="CPF / CNPJ"
                          error={errors.cpfCnpj}
                          {...register("cpfCnpj")}
                        ></Input>
                        <Input
                          isLoading={isLoading}
                          name="situacaoCadastral"
                          autoFocus={true}
                          label="Situação cadastral"
                          error={errors.situacaoCadastral}
                          {...register("situacaoCadastral")}
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
