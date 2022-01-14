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
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as yup from "yup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
import { LoadPage } from "../../components/Load";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Input";
import { withSSRAuth } from "../../utils/withSSRAuth";

type FormData = {
  nome: string;
};

const categoriaFormSchema = yup.object().shape({
  nome: yup.string().required("Nome obrigatório"),
});

export default function FormCategoria() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const categoriaId: any = Object.keys(router.query)[0];

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(categoriaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findCategoria() {
      setIsLoading(true);

      if (categoriaId) {
        const response: any = await api.get(`/categorias/${categoriaId}`);

        const { nome } = response.data.categoria;

        setValue("nome", nome);
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findCategoria();
    }
    focus();
  }, []);

  const handleCategoria: SubmitHandler<FormData> = async (values) => {
    const data = {
      usuario: user,
      empresa: user.empresa,
      nome: values.nome,
    };

    try {
      if (categoriaId) {
        await api.patch(`/categorias/${categoriaId}`, {
          ...data,
        });
      } else {
        await api.post(`/categorias`, {
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
        <title>MEIUP | Categoria</title>
      </Head>
      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleCategoria)}>
            <Box
              borderBottom="1px"
              borderLeft="1px"
              borderRight="1px"
              borderRadius="lg"
              borderColor="gray.300"
            >
              <Tabs isFitted variant="enclosed">
                <TabList>
                  <Tab>Categoria</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
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
