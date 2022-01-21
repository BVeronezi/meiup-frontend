import { Button, Center, Text } from "@chakra-ui/react";
import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import NextLink from "next/link";

export function ButtonSocial() {
  const url_google = `${process.env.API_URL}/auth/google`;

  return (
    <>
      <Button
        variant={"outline"}
        leftIcon={<FaFacebookF />}
        fontWeight="medium"
        size="md"
        w={"full"}
        color="white"
        bg="#3b5998"
        _hover={{
          bg: "#8b9dc3",
        }}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        <Center>
          <Text> Continuar com o Facebook</Text>
        </Center>
      </Button>

      <NextLink href={url_google}>
        <Button
          variant={"outline"}
          leftIcon={<FcGoogle />}
          fontWeight="medium"
          size="md"
          w={"full"}
          border="1px"
          borderColor="#444"
          color="#444"
          bg="white"
          _hover={{
            bg: "gray.100",
          }}
        >
          <Center>
            <Text> Continuar com o Google</Text>
          </Center>
        </Button>
      </NextLink>
    </>
  );
}
