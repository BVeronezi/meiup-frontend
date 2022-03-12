import { Flex, FlexProps, Icon, Link } from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons/lib";
import { ActiveLink } from "../ActiveLink";
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string;
}

export const NavItem = ({ icon, href, children }: NavItemProps) => {
  return (
    <ActiveLink href={href} passHref>
      <Link
        href={href}
        color="white"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "yellow.500",
            color: "white",
          }}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </ActiveLink>
  );
};
