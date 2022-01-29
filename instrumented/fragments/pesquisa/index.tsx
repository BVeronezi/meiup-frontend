import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

export function Pesquisa({ handleChange }) {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        // eslint-disable-next-line react/no-children-prop
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        size="sm"
        type="tel"
        placeholder="Pesquisar"
        onChange={handleChange}
      />
    </InputGroup>
  );
}
