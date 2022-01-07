/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");

import { Headings } from "../../components/Heading";
import { Input } from "../../components/Input";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
import { useRouter } from "next/router";
import { InfoOutlineIcon, ViewIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../contexts/AuthContext";
import { Endereco } from "../../fragments/endereco";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

type FormData = {
  nome: string;
  email: string;
  role: string;
  senha: string;
  telefone: number;
  celular: number;
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
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  role: yup.string().required("Perfil obrigatório"),
  cep: yup.string().required("CEP obrigatório"),
  endereco: yup.string().required("Endereço obrigatório"),
});

export default function FormUsuario() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(usuarioFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function findUsuario() {
      setIsLoading(false);

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

      setIsLoading(true);
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

  const handleClick = () => setShow(!show);

  const handleUsuario: SubmitHandler<FormData> = async (values) => {
    const data = {
      nome: values.nome,
      role: values.role,
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
      console.log(err);
    }
  };

  return (
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
              <Tab>Dados básicos</Tab>
              <Tab>Endereço</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack k marginTop="14px" spacing="12">
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      name="nome"
                      autoFocus={true}
                      label="Nome *:"
                      error={errors.nome}
                      {...register("nome")}
                    ></Input>

                    <Input
                      name="email"
                      type="email"
                      label="E-mail *:"
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
                      name="celular"
                      label="Celular:"
                      {...register("celular")}
                    ></Input>
                    <Input
                      name="telefone"
                      label="Telefone:"
                      {...register("telefone")}
                    ></Input>

                    <Box>
                      <FormLabel htmlFor="perfil">Perfil *:</FormLabel>
                      <Select
                        {...register("role")}
                        variant="flushed"
                        error={errors.role}
                        borderBottomColor="gray.400"
                        focusBorderColor="yellow.500"
                        size="lg"
                      >
                        <option value="USER">Funcionário</option>
                        <option value="ADMIN">Administrador</option>
                      </Select>
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
                              aria-label="Input Password"
                              icon={<ViewIcon />}
                              size="sm"
                              onClick={handleClick}
                            />
                          </InputRightElement>
                        </InputGroup>

                        {!!errors.senha && (
                          <FormErrorMessage>
                            {errors.senha.message}
                          </FormErrorMessage>
                        )}
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
                width="200px"
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
                width="200px"
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
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
