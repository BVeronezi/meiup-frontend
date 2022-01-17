import { Box, SimpleGrid, VStack } from "@chakra-ui/layout";
import { Input } from "../../components/Input";

export function Endereco({ register, errors, isLoading, buscaCep }) {
  return (
    <VStack marginTop="14px" spacing="12">
      <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
        <Input
          isLoading={isLoading}
          name="cep"
          label="CEP"
          error={errors.cep}
          {...register("cep")}
          onChange={(c) => buscaCep(c.target.value)}
        ></Input>

        <Input
          isLoading={isLoading}
          name="endereco"
          label="Endereço"
          error={errors.endereco}
          {...register("endereco")}
        ></Input>
      </SimpleGrid>

      <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
        <Input
          isLoading={isLoading}
          name="numero"
          label="Número"
          {...register("numero")}
        ></Input>

        <Input
          isLoading={isLoading}
          name="bairro"
          label="Bairro"
          {...register("bairro")}
        ></Input>
      </SimpleGrid>

      <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
        <Input
          isLoading={isLoading}
          name="cidade"
          label="Cidade"
          {...register("cidade")}
        ></Input>
        <Input
          isLoading={isLoading}
          name="estado"
          label="Estado"
          {...register("estado")}
        ></Input>
      </SimpleGrid>

      <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
        <Input
          isLoading={isLoading}
          name="complemento"
          label="Complemento"
          {...register("complemento")}
        ></Input>
      </SimpleGrid>
    </VStack>
  );
}
