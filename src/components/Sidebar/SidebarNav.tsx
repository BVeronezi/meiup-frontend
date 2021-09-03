import { Box, Divider, Stack } from "@chakra-ui/react";
import { NavLink } from "./NavLink";
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
    RiStackLine } 
    from "react-icons/ri";
import { NavSection } from "./NavSection";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export function SidebarNav() {

    const { signOut } = useContext(AuthContext);

    return (
    <>
    <Divider />
        <Stack spacing="30" align="flex-start" ml="6" mt="4">
        
            <NavLink icon={RiDashboardLine} href="/dashboard">INÍCIO</NavLink>

            <NavSection title="EMPRESA">
            <NavLink icon={RiBuilding4Line} href="/dados-gerais">Dados gerais</NavLink>
            <NavLink icon={RiContactsLine} href="/usuarios">Usuários</NavLink>
            </NavSection>

            <NavSection title="CATAlÓGO">
            <NavLink icon={RiStackFill} href="/produtos">Produtos</NavLink>
            <NavLink icon={RiStackLine} href="/servicos">Serviços</NavLink>
            <NavLink icon={RiInboxLine} href="/categorias">Categorias</NavLink>
            </NavSection>

            <NavSection title="VENDAS">
            <NavLink icon={RiShoppingBasket2Line} href="/vendas">Vendas</NavLink>
            <NavLink icon={RiGroupLine} href="/clientes">Clientes</NavLink>
            <NavLink icon={RiPriceTag3Line} href="/promocoes">Promoções</NavLink>
            </NavSection>

            <NavSection title="COMPRAS">
            <NavLink icon={RiShoppingCartLine} href="/compras">Compras</NavLink>
            </NavSection>
            

            <NavSection title="AGENDA">

            </NavSection>

            <NavSection title="RELATÓRIOS">
                
            </NavSection>
        
            <Box>
                <NavLink mb="20px" icon={RiLoginBoxLine} href="#" onClick={signOut}>SAIR</NavLink>
            </Box>
      
        </Stack>
     </>
    )
}