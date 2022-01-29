import NextLink from "next/link";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Box,
  Checkbox,
  Input,
  Flex,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  FormControl,
  createStandaloneToast,
  Stack,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { theme as customTheme } from "../../styles/theme";
import { MDivider } from "../../components/Divider";
import { ButtonSocial } from "../../components/ButtonSocial";
import MButton from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { useRouter } from "next/router";
import { RiArrowLeftSLine } from "react-icons/ri";

type UserFormData = {
  email: string;
  senha: string;
};

const userFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  senha: yup.string().required("Senha obrigatória"),
});

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });

  const { signIn } = useContext(AuthContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(userFormSchema),
  });

  const { errors } = formState;

  const handleClick = () => setShow(!show);

  const handleSignIn: SubmitHandler<UserFormData> = async (user: any) => {
    try {
      await signIn(user);
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
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <IconButton
          variant="link"
          colorScheme="black"
          size="lg"
          aria-label="voltar"
          icon={<RiArrowLeftSLine />}
          onClick={() => router.replace("/")}
        />
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Fazer login
              </Heading>
              <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                Digite seu usuário e senha
              </Text>
            </Stack>

            <Box as={"form"} mt={10} onSubmit={handleSubmit(handleSignIn)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    _placeholder={{ color: "gray.700" }}
                    placeholder="Email *"
                    variant="flushed"
                    {...register("email")}
                  />
                  {!!errors.email && (
                    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.senha}>
                  <InputGroup size="md">
                    <Input
                      _placeholder={{ color: "gray.700" }}
                      placeholder="Senha *"
                      variant="flushed"
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
                    <FormErrorMessage>{errors.senha.message}</FormErrorMessage>
                  )}
                </FormControl>

                <HStack justify="space-between">
                  <Checkbox>Lembrar-me</Checkbox>
                  <NextLink href="/passwordReset" passHref>
                    <Text as="a" textStyle="a">
                      Esqueci minha senha
                    </Text>
                  </NextLink>
                </HStack>

                <MButton
                  color="black"
                  background="yellow.900"
                  hoverColor="yellow.500"
                  width="100"
                  type="submit"
                  isLoading={formState.isSubmitting}
                >
                  Entrar
                </MButton>

                <HStack justify="center">
                  <Text>Não tem conta?</Text>
                  <NextLink href="/sign-up" passHref>
                    <Text as="a" textStyle="a">
                      Cadastre-se
                    </Text>
                  </NextLink>
                </HStack>

                <MDivider label="ou" />
                <ButtonSocial />
              </Stack>
            </Box>
          </Stack>
        </Flex>

        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1638376776402-9a4b75fe21bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=977&q=80"
            }
          />
        </Flex>
      </Stack>
    </>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
