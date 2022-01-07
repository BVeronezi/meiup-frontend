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
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { Input } from "../../components/Input";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
import { Endereco } from "../../fragments/endereco";
import { Sidebar } from "../../components/Sidebar";

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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(empresaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findEmpresa() {
      setIsLoading(false);
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
        setIsLoading(true);
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
      const resultCep: any = await axios.get(
        `https://api.cnpja.com.br/zip/${cep}`,
        {
          headers: {
            Authorization:
              "d7756953-d64d-46a3-8a7f-ffb409dd20a0-38e52cca-6626-41e9-950b-f69496b95a0a",
          },
        }
      );

      if (resultCep.data) {
        const { zip, street, district, city, state } = resultCep.data;

        setValue("cep", zip);
        setValue("endereco", street);
        setValue("numero", "");
        setValue("bairro", district);
        setValue("cidade", city);
        setValue("estado", state);
        setValue("complemento", "");
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
      console.log(err);
    }
  };

  return (
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
            <TabList overflowX="auto">
              <Tab>Informações da empresa</Tab>
              <Tab>Endereço</Tab>
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
                      name="cnpj"
                      autoFocus={true}
                      label="CNPJ *:"
                      error={errors.cnpj}
                      {...register("cnpj")}
                      onChange={(c) => consultaCpfCnpj(c.target.value)}
                    ></Input>
                    <Input
                      name="ie"
                      label="Inscrição Estadual:"
                      {...register("ie")}
                    ></Input>
                  </SimpleGrid>

                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="razaoSocial"
                      label="Razão Social *:"
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
                      name="telefone"
                      label="Telefone:"
                      {...register("telefone")}
                    ></Input>

                    <Input
                      name="celular"
                      label="Celular:"
                      {...register("celular")}
                    ></Input>

                    <Input
                      name="email"
                      type="email"
                      label="E-mail:"
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
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
