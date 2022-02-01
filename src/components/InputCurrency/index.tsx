import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  Skeleton,
} from "@chakra-ui/react";
import NumberFormat from "react-number-format";
import { Input } from "../Input";
interface InputProps extends ChakraInputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: FieldError;
  isLoading?: boolean;
  onValueChange?: any;
  isDisabled?: boolean;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({
  id,
  name,
  label,
  error = null,
  value,
  isLoading = false,
  onValueChange,
  onBlur,
  isDisabled = false,
}) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel fontWeight="bold" color="gray.800" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Skeleton isLoaded={!isLoading}>
        <NumberFormat
          id={id}
          value={value}
          customInput={Input}
          format={currencyFormatter}
          onBlur={onBlur}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          isNumericString
        />

        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </Skeleton>
    </FormControl>
  );
};

export const InputCurrency = forwardRef(InputBase);

export default function currencyFormatter(value) {
  if (!Number(value)) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);

  return `${amount}`;
}
