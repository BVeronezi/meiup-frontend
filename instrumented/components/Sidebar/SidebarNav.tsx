import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import {
  RiBuilding4Line,
  RiContactsLine,
  RiDashboardLine,
  RiGroupLine,
  RiInboxLine,
  RiLoginBoxLine,
  RiPriceTag3Line,
  RiShoppingBasket2Line,
  RiShoppingCartLine,
  RiStackFill,
  RiStackLine,
} from "react-icons/ri";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { NavItem } from "./NavItem";

export function SidebarNav() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <Divider />
      <NavItem
        mt={4}
        icon={RiDashboardLine}
        children="INÍCIO"
        href="/dashboard"
      />

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">EMPRESA</Text>
      </Flex>

      <NavItem
        icon={RiBuilding4Line}
        children="Dados gerais"
        href="/dados-gerais"
      />
      <NavItem icon={RiContactsLine} children="Usuários" href="/usuarios" />

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500"> CATÁLOGO</Text>
      </Flex>

      <NavItem icon={RiStackFill} children="Produtos" href="/produtos" />
      <NavItem icon={RiStackLine} children="Serviços" href="/servicos" />
      <NavItem icon={RiInboxLine} children="Categorias" href="/categorias" />

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">VENDAS</Text>
      </Flex>
      <NavItem icon={RiShoppingBasket2Line} children="Vendas" href="/vendas" />
      <NavItem icon={RiGroupLine} children="Clientes" href="/clientes" />
      <NavItem
        icon={RiPriceTag3Line}
        children="Promoções - (Em breve)"
        href="/promocoes"
      />

      {/* <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">COMPRAS</Text>
      </Flex> */}

      {/* <NavItem
        icon={RiShoppingCartLine}
        children="Compras"
        href="/compras"
      /> */}

      {/* <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">AGENDA</Text>
      </Flex>

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">RELATÓRIOS</Text>
      </Flex> */}

      <Divider />

      <NavItem
        icon={RiLoginBoxLine}
        children="SAIR"
        href="#"
        onClick={signOut}
      />
    </>
  );
}
