import React from "react";
import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Image, useBreakpointValue } from "@chakra-ui/react";
import { useSidebarDrawer } from "../../contexts/SidebarDrawersContext";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
    const { isOpen, onClose} = useSidebarDrawer();

    const isDrawerSidebar = useBreakpointValue({
        base: true,
        lg: false
    })

    if (isDrawerSidebar) {
        return (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay>
                  <DrawerContent bg="gray.800" p="4">
                      <DrawerCloseButton mt="6"/>
                      <DrawerHeader>
                        <Box justify="center" align="center">
                            <Image width="10rem" src="/logo.png" alt="Logo MEIUP" />
                        </Box>   
                      </DrawerHeader>  
                      <DrawerBody>
                          <SidebarNav />
                      </DrawerBody>
  
                  </DrawerContent>
              </DrawerOverlay>
          </Drawer>
        )
      }
    
    return (
        <Box h="100%" as="aside" w="64">
            <SidebarNav />
        </Box>
    )
}