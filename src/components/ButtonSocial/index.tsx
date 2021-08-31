import { Button } from '@chakra-ui/react';
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from "react-google-login";
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export function ButtonSocial() {

    const responseFacebook = (response: any) => {
        console.log(response);
    }

    return (
        <>
         <FacebookLogin
            appId="1088597931155576"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            render={(renderProps: any) => (
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
              )}
          />
        <GoogleLogin
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            onSuccess={() => {}}
            onFailure={() => {}}                                
            cookiePolicy={'single_host_origin'}
            render={(renderProps: any) => (
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
                    onClick={() => {}}
                >
               Continuar com o Google
               </Button>
             )}
        />       
        </>
    )
}