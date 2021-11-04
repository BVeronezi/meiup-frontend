import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/dist/client/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import InputMask from "react-input-mask";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require('@hookform/resolvers/yup')
import { Box, 
    Container,
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
    AlertDialog, 
    AlertDialogOverlay, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogBody, 
    AlertDialogFooter, 
    Button, 
    createStandaloneToast
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

import { MDivider } from "../../components/Divider";
import { ButtonSocial } from "../../components/ButtonSocial";
import MButton from "../../components/Button";
import { api } from "../../services/apiClient";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { theme as customTheme } from "../../styles/theme";

type UserFormData = {
    email: string;
    senha: string;
}

const userFormSchema = yup.object().shape({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    senha: yup.string().required('Senha obrigatória').min(6, 'Senha deve conter no mínimo 6 caracteres'),
})

export default function SignUp() {
    const router = useRouter();
    const toast = createStandaloneToast({theme: customTheme})
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [show, setShow] = useState(false)

    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(userFormSchema)
      });

    const { errors } = formState;

    const handleClick = () => setShow(!show)

    const handleSignUp: SubmitHandler<UserFormData> = async (user) => {
     
        try {
            await api.post('/auth/signup', {
                    ...user,
                    created_at: new Date(),
            })


            toast({
                title: "Conta criada com sucesso!",
                status: "success",
                duration: 2000,
                isClosable: true,
            })   

            router.push('/login')
        } catch (err) {
            setError(true);
            setIsOpen(true);
        } 
    }

    return (
      <>
      <Box bg="gray.900" h="18rem"> 
          <Container justify="center" align="center" p="6">
              <Image src="/logo.png" alt="Logo MEIUP" />
          </Container>   
 
          <Flex  as="form" onSubmit={handleSubmit(handleSignUp)} justify="center">        
            <Box boxShadow="xl" color="black" bg="white" width="26rem" rounded="md" h="auto" p="6">
                    <Box align="center">
                        <Heading as="h4" size="md">Criar uma conta</Heading>
                        <Text>Preencha o e-mail, e uma senha forte.</Text>
                    </Box>

                    <SimpleGrid mt={10} spacing={4}>
                        <FormControl isInvalid={!!errors.email}>
                            <Input 
                                placeholder="Email"
                                variant="flushed" 
                                {...register('email')}
                            />
                            {!!errors.email &&  (
                                <FormErrorMessage>
                                    {errors.email.message}
                                </FormErrorMessage>
                            )}   
                        </FormControl>

                        <FormControl>
                            <Input 
                                placeholder="CNPJ"
                                as={InputMask}
                                mask="**.***.****/****-**"
                                variant="flushed" 
                                {...register('cnpj')}
                            />
                        </FormControl>
            
                        <FormControl isInvalid={!!errors.senha}>
                            <InputGroup size="md">
                                <Input
                                    placeholder="Senha"
                                    variant="flushed" 
                                    type={show ? "text" : "password"}
                                    {...register('senha')}
                                />
                                <InputRightElement width="2.5rem">
                                    <IconButton aria-label="Input Password" icon={<ViewIcon/>} size="sm" onClick={handleClick}/>
                                </InputRightElement>
                            </InputGroup>

                            {!!errors.senha && (
                                <FormErrorMessage>
                                    {errors.senha.message}
                                </FormErrorMessage>
                            )}   
                        </FormControl>

                            <MButton 
                            color="black" 
                            background="yellow.900" 
                            hoverColor="yellow.500" 
                            width="100" 
                            type="submit" 
                            isLoading={formState.isSubmitting}
                            >
                                Cadastrar
                            </MButton>
                        <HStack justify="center">
                            <Text>Já tem uma conta?</Text>
                            <NextLink href="/login" passHref>
                                <Text as="a">Entre</Text>
                            </NextLink>
                        </HStack>
                        <MDivider label="ou"/>
                    <ButtonSocial />
                </SimpleGrid>
                     
            </Box>  

            { error && (
                    <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" color="black" fontWeight="bold">
                            Erro ao cadastrar
                        </AlertDialogHeader>

                        <AlertDialogBody color="black">
                            E-mail já cadastrado no sistema
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} colorScheme="red" onClick={onClose}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                    </AlertDialog>
                            )}

          </Flex>
      </Box>
  </>
    )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
    return {
      props: {
  
      }
    }
});