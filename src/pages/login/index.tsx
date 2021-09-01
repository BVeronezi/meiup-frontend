import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Checkbox, Container, Input,  Flex, FormErrorMessage, Heading, HStack, IconButton, Image, InputGroup, InputRightElement, SimpleGrid, Text, Button, FormControl, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

import { MDivider } from "../../components/Divider";
import { ButtonSocial } from "../../components/ButtonSocial";
import MButton from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRGuest } from "../../utils/withSSRGuest";

type UserFormData = {
    email: string;
    senha: string;
}

const userFormSchema = yup.object().shape({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    senha: yup.string().required('Senha obrigatória'),
})

export default function Login() {
    const [show, setShow] = useState(false)

    const { signIn } = useContext(AuthContext);

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(userFormSchema)
      });

    const { errors } = formState;

    const handleClick = () => setShow(!show)

    const handleSignIn: SubmitHandler<UserFormData> = async(user: any) => {
        try {
            await signIn(user);   
        } catch (err) {
           console.log(err)
        } 
    }

    return (
        <>
         <Box bg="gray.900" h="18rem"> 
            <Container justify="center" align="center" p="6">
                <Image src="/logo.png" alt="Logo MEIUP" />
            </Container>   

            <Flex as="form" onSubmit={handleSubmit(handleSignIn)} justify="center">
                <Box boxShadow="xl" color="black" bg="white" width="26rem" rounded="md" h="auto" p="6">
                    <Box align="center">
                        <Heading as="h4" size="md">Fazer login</Heading>
                        <Text >Digite seu usuário e senha</Text>
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

                            <HStack justify="space-between">
                                <Checkbox>Lembrar-me</Checkbox>
                                <NextLink href="/passwordReset" passHref>
                                        <Text as="a">Esqueci minha senha</Text>
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
                                    <Text as="a">Cadastre-se</Text>
                                </NextLink>
                            </HStack>

                        <MDivider label="ou"/>
                        <ButtonSocial />
                    </SimpleGrid>
                    
                </Box>   
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