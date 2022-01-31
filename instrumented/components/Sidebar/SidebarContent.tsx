import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  RiBuilding4Line,
  RiContactsLine,
  RiDashboardLine,
} from "react-icons/ri";
import { NavItem } from "./NavItem";
import { SidebarNav } from "./SidebarNav";

interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "16px",
          backgroundColor: "gray.800",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray.800",
        },
      }}
      h="100%"
      transition="3s ease"
      bg="gray.800"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image width="10rem" src="/logo.png" alt="Logo MEIUP" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <SidebarNav />
    </Box>
  );
};
