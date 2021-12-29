import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

type ContainerPageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ContainerPage({
  title,
  subtitle,
  children,
}: ContainerPageProps) {
  return (
    <Flex w="100wv" direction="column">
      <Box w="100%">
        <Header title={title} subtitle={subtitle} />
      </Box>

      <Flex>
        <Sidebar />
        <Box flex="1" p="6">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
