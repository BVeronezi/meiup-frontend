/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
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
  cnpj: string;
  razaoSocial: string;
  ie: number;
  telefone: number;
  celular: number;
  email: string;
  cep: number;
  endereco: string;
  estado: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
};

const empresaFormSchema = yup.object().shape({
  cnpj: yup.string().required("CNPJ obrigatório"),
  razaoSocial: yup.string().required("Razão social obrigatória"),
  cep: yup.string().required("CEP obrigatório"),
  endereco: yup.string().required("Endereço obrigatório"),
});

export default function DadosGerais() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(empresaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findEmpresa() {
      setIsLoading(true);
      const empresaId: any = user?.empresa?.id;

      if (empresaId) {
        const response: any = await api.get(`empresa/${empresaId}`);

        Object.entries(response.data.empresa).forEach(([key, value]) => {
          if (key !== "endereco") {
            setValue(key, value);
          }
        });

        if (response.data.empresa.endereco) {
          Object.entries(response.data.empresa.endereco).forEach(
            ([key, value]) => {
              setValue(key, value);
            }
          );
        }
        setIsLoading(false);
      }
    }

    findEmpresa();

    focus();
  }, [user]);

  const consultaCpfCnpj = async (value) => {
    const cpfCnpj = value.replace(/[^0-9]/g, "");

    if (cpfCnpj.length == "14") {
      const resultConsulta: any = await axios.get(
        `https://api.cnpja.com.br/companies/${cpfCnpj}`,
        {
          headers: {
            Authorization:
              "d7756953-d64d-46a3-8a7f-ffb409dd20a0-38e52cca-6626-41e9-950b-f69496b95a0a",
          },
        }
      );

      if (resultConsulta.data) {
        const { name, email } = resultConsulta.data;
        const { zip, street, number, neighborhood, city, state, details } =
          resultConsulta.data.address;

        setValue("razaoSocial", name);
        setValue("email", email);
        setValue("cep", zip);
        setValue("endereco", street);
        setValue("numero", number);
        setValue("bairro", neighborhood);
        setValue("cidade", city);
        setValue("estado", state);
        setValue("complemento", details);
      }
    }
  };

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
        setValue("endereco", "");
        setValue("numero", "");
        setValue("bairro", "");
        setValue("cidade", "");
        setValue("estado", "");
        setValue("complemento", "");

        toast({
          title: "CEP não encontrado",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDadosGerais: SubmitHandler<FormData> = async (values) => {
    const data = {
      cnpj: values.cnpj,
      razaoSocial: values.razaoSocial,
      ie: values.ie,
      telefone: values.telefone,
      celular: values.celular,
      email: values.email,
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
      const empresaId: any = user.empresa?.id;
      await api.patch(`/empresa/${empresaId}`, {
        ...data,
      });

      toast({
        title: "Dados salvos com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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
        <title>MEIUP | Empresa</title>
      </Head>

      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleDadosGerais)} flex="1">
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab data-cy="info-empresa" fontWeight="bold">
                    Informações da empresa
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
                          name="cnpj"
                          autoFocus={true}
                          label="CNPJ *"
                          error={errors.cnpj}
                          {...register("cnpj")}
                          onChange={(c) => consultaCpfCnpj(c.target.value)}
                        ></Input>
                        <Input
                          isLoading={isLoading}
                          name="ie"
                          label="Inscrição Estadual"
                          {...register("ie")}
                        ></Input>
                      </SimpleGrid>

                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <Input
                          isLoading={isLoading}
                          name="razaoSocial"
                          label="Razão Social *"
                          error={errors.razaoSocial}
                          {...register("razaoSocial")}
                        ></Input>
                      </SimpleGrid>

                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <Input
                          isLoading={isLoading}
                          name="telefone"
                          label="Telefone"
                          {...register("telefone")}
                        ></Input>

                        <Input
                          isLoading={isLoading}
                          name="celular"
                          label="Celular"
                          {...register("celular")}
                        ></Input>

                        <Input
                          isLoading={isLoading}
                          name="email"
                          type="email"
                          label="E-mail"
                          {...register("email")}
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
            <Flex justify="flex-end">
              <Button
                data-cy="salvar"
                width={["150px", "200px"]}
                fontSize={["14px", "16px"]}
                mt="8"
                type="submit"
                color="white"
                backgroundColor="blue.500"
                isLoading={formState.isSubmitting}
              >
                SALVAR
              </Button>
            </Flex>
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
