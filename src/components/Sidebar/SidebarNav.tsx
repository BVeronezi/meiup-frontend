import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import {
  RiBuilding4Line,
  RiCalendarTodoFill,
  RiContactsLine,
  RiDashboardLine,
  RiDatabase2Line,
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
  const { user, signOut } = useContext(AuthContext);

  return (
    <>
      <Divider />
      <NavItem mt={4} icon={RiDashboardLine} href="/dashboard">
        INÍCIO
      </NavItem>

      {user?.tipo === "MEI" && (
        <>
          <Flex align="center" fontWeight="bold" p="4" mx="4">
            <Text color="gray.500">EMPRESA</Text>
          </Flex>

          <NavItem icon={RiBuilding4Line} href="/dados-gerais">
            Dados gerais
          </NavItem>
          <NavItem icon={RiContactsLine} href="/usuarios">
            Usuários
          </NavItem>
        </>
      )}

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500"> CATÁLOGO</Text>
      </Flex>

      <NavItem icon={RiStackFill} href="/produtos">
        Produtos
      </NavItem>
      <NavItem icon={RiStackLine} href="/servicos">
        Serviços
      </NavItem>
      <NavItem icon={RiInboxLine} href="/categorias">
        Categorias
      </NavItem>

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">VENDAS</Text>
      </Flex>
      <NavItem icon={RiShoppingBasket2Line} href="/vendas">
        Vendas
      </NavItem>
      <NavItem icon={RiGroupLine} href="/clientes">
        Clientes
      </NavItem>
      <NavItem icon={RiPriceTag3Line} href="/promocoes">
        Promoções
      </NavItem>

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">COMPRAS</Text>
      </Flex>

      <NavItem icon={RiShoppingCartLine} href="/fornecedores">
        Fornecedores
      </NavItem>

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">CALENDÁRIO</Text>
      </Flex>

      <NavItem icon={RiCalendarTodoFill} href="/agenda">
        Agenda
      </NavItem>

      <Flex align="center" fontWeight="bold" p="4" mx="4">
        <Text color="gray.500">RELATÓRIOS</Text>
      </Flex>

      <NavItem icon={RiDatabase2Line} href="/relatorios">
        Relatórios
      </NavItem>

      <Divider />

      <NavItem icon={RiLoginBoxLine} href="#" onClick={signOut}>
        SAIR
      </NavItem>
    </>
  );
}
