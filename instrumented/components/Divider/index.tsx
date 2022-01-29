import { Divider, HStack, Text } from "@chakra-ui/react";

type MDividerProps = {
    label: string;
}

export function MDivider({ label }: MDividerProps) {
    return (
        <HStack>
            <Divider borderColor="blackAlpha.600"/>
                <Text>{label}</Text>
            <Divider borderColor="blackAlpha.600"/>
        </HStack>
    )
}