import React, { ButtonHTMLAttributes } from 'react'
import { Button } from '@chakra-ui/react'

type ButtonTypes =
  | ButtonHTMLAttributes<HTMLButtonElement>

type MButtonProps = {
    children: string;
    width?: string;
    color?: string;
    background?: string;
    hoverColor?: string;
    isLoading?: boolean;
    handleClick?: (event: any) => void;
} & ButtonTypes

export default function MButton({ children, width = "40", color = "white",  background = "gray.700", 
hoverColor = "gray.500", handleClick, isLoading, ...rest }: MButtonProps) {

    return (
        <Button 
            fontSize="18px"
            fontWeight="medium"
            width={width}
            color={color}
            bg={background}
            size="md"
            _hover={{
                bg: hoverColor
            }}
            onClick={handleClick}
            isLoading={isLoading}
            {...rest}
        >
            {children}
        </Button>
    )

}