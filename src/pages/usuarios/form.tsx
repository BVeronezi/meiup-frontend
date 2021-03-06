import { InfoOutlineIcon, ViewIcon } from "@chakra-ui/icons";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
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
  tipo: string;
  senha: string;
  telefone: number;
  celular: number;
  cep: string;
  endereco: string;
  estado: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
};

const usuarioFormSchema = yup.object().shape({
  nome: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  senha: yup.string(),
  tipo: yup.string().required("Perfil obrigatório"),
  cep: yup.string(),
  endereco: yup.string(),
  estado: yup.string(),
  numero: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  complemento: yup.string(),
});

export default function FormUsuario() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(usuarioFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findUsuario() {
      setIsLoading(true);

      const usuarioId: any = Object.keys(router.query)[0];

      if (usuarioId) {
        const response: any = await api.get(`/usuario/${usuarioId}`);

        Object.entries(response.data.user).forEach(([key, value]) => {
          if (key !== "endereco") {
            setValue(key, value);
          }
        });

        if (response.data.user.endereco) {
          Object.entries(response.data.user.endereco).forEach(
            ([key, value]) => {
              setValue(key, value);
            }
          );
        }
      }

      setIsLoading(false);
    }

    if (Object.keys(router.query)[0]) {
      findUsuario();
    } else {
      const senha = Math.random().toString(36).slice(-8);
      setValue("senha", senha);
    }

    focus();
  }, []);

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

  const handleClick = () => setShow(!show);

  const handleUsuario: SubmitHandler<FormData> = async (values) => {
    const data = {
      nome: values.nome,
      tipo: values.tipo,
      email: values.email,
      senha: values.senha,
      telefone: values.telefone,
      celular: values.celular,
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
      const usuarioId: any = Object.keys(router.query)[0];

      if (usuarioId) {
        await api.patch(`/usuario/${usuarioId}`, {
          ...data,
        });
      } else {
        await api.post(`/usuario`, {
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
        <title>MEIUP | Usuário</title>
      </Head>

      <LoadPage active={isLoading}>
        <Sidebar>
          <Stack as="form" onSubmit={handleSubmit(handleUsuario)} flex="1">
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
                          label="E-mail *"
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

                        <Box>
                          <FormLabel fontWeight="bold" htmlFor="perfil">
                            Perfil *
                          </FormLabel>
                          <Skeleton isLoaded={!isLoading}>
                            <Select
                              data-cy="perfil"
                              {...register("tipo")}
                              variant="flushed"
                              error={errors.tipo}
                              borderBottomColor="gray.400"
                              focusBorderColor="yellow.500"
                              size="lg"
                            >
                              <option value="USER">Funcionário</option>
                              <option value="ADMIN">Administrador</option>
                            </Select>
                          </Skeleton>
                        </Box>

                        {!Object.keys(router.query)[0] && (
                          <FormControl isInvalid={!!errors.senha}>
                            <FormLabel htmlFor="senha">
                              SENHA
                              <Tooltip
                                label="Senha gerada automaticamente para o primeiro acesso"
                                fontSize="md"
                              >
                                <Icon as={InfoOutlineIcon} size="10px" ml="2" />
                              </Tooltip>
                            </FormLabel>
                            <InputGroup size="md">
                              <Input
                                variant="flushed"
                                isDisabled
                                type={show ? "text" : "password"}
                                {...register("senha")}
                              />
                              <InputRightElement width="2.5rem">
                                <IconButton
                                  data-cy="exibirSenha"
                                  aria-label="Input Password"
                                  icon={<ViewIcon />}
                                  size="sm"
                                  onClick={handleClick}
                                />
                              </InputRightElement>
                            </InputGroup>
                          </FormControl>
                        )}
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
