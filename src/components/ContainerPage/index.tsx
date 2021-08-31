import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

type ContainerPageProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function ContainerPage({ title, subtitle, children}: ContainerPageProps) {
    return (
        <Flex bg="gray.900" direction="column">
        <Header title={title} subtitle={subtitle}  />
        <Flex color="black">
            <Sidebar />
            <Box bg="white" flex="1">
                <Flex p="6">
                    {children}
                </Flex>
            </Box>          
        </Flex>
     </Flex>
    )
}