import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  Img,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../contexts/SidebarDrawersContext";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex bg="gray.900" h="20" w="100%" align="center">
      {!isWideVersion && (
        <IconButton
          color="white"
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        ></IconButton>
      )}

      {isWideVersion && (
        <Box ml="41px" justify="center" align="center">
          <Img width="10rem" src="/logo.png" alt="Logo MEIUP" />
        </Box>
      )}

      {isWideVersion && (
        <Divider ml="55px" orientation="vertical" color="red" height="110px" />
      )}

      <Box ml="1rem">
        <Text color="white" fontSize="24px">
          {title}
        </Text>
        <Text color="white" fontWeight="medium" fontSize="16px">
          {subtitle}
        </Text>
      </Box>
    </Flex>
  );
}
