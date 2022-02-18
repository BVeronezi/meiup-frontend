import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export function PageNotFound() {
  const router = useRouter();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        title="404"
        size="2xl"
        bgGradient="linear(to-r, gray.400, gray.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Página em construção
      </Text>

      <Button
        colorScheme="yellow"
        bgGradient="linear(to-r, gray.400, gray.500, gray.600)"
        color="white"
        variant="solid"
        onClick={() => router.replace("/dashboard")}
      >
        Voltar para o início
      </Button>
    </Box>
  );
}
