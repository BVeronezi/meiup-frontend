import { Button } from '@chakra-ui/react';
import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import NextLink from 'next/link'

export function ButtonSocial() {

    const url_google = `http://localhost:8000/api/v1/auth/google`;

     return (
        <>
            <Button
                leftIcon={<FaFacebookF />}
                fontWeight="medium"
                size="md" 
                width="100"
                color="white"
                bg="#3b5998"
                _hover={{
                    bg: '#8b9dc3'
                }}
                onClick={(event) => {event.preventDefault()}}
                >
               Continuar com o Facebook
            </Button>
          
            <NextLink href={url_google}>
            <Button
                leftIcon={<FcGoogle />}
                fontWeight="medium"
                size="md" 
                width="100"
                border="1px"
                borderColor="#444"
                color="#444"
                bg="white"
                _hover={{
                    bg: 'gray.100'
                }}
                >
               Continuar com o Google
            </Button>  
            </NextLink>
        </>
    )
}