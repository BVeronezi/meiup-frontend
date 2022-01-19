import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import { FieldError } from "react-hook-form";
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  Skeleton,
} from "@chakra-ui/react";
interface InputProps extends ChakraInputProps {
  name?: string;
  label?: string;
  error?: FieldError;
  isLoading?: boolean;
  onValueChange?: ReactNode;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, isLoading = false, onValueChange, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel fontWeight="bold" color="gray.800" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Skeleton isLoaded={!isLoading}>
        <ChakraInput
          name={name}
          id={name}
          onValueChange={onValueChange}
          focusBorderColor="yellow.500"
          variant="flushed"
          bg="white"
          borderColor="gray.400"
          size="lg"
          ref={ref}
          {...rest}
        />

        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </Skeleton>
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
