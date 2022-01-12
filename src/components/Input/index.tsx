import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";
interface InputProps extends ChakraInputProps {
  name?: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel fontWeight="bold" color="gray.800" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="yellow.500"
        variant="flushed"
        bg="white"
        borderColor="gray.400"
        size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
