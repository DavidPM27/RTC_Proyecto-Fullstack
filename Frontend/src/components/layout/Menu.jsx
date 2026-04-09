import {
  Box,
  VStack,
  Icon,
  Text,
  HStack,
  Link as ChakraLink,
  Flex,
} from "@chakra-ui/react";
import { LuLeaf, LuLayoutGrid, LuSearch, LuUser } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";

const navItems = [
  { label: "Home", icon: LuLayoutGrid, href: "/" },
  { label: "Explorer", icon: LuSearch, href: "/catalog" },
  { label: "Profile", icon: LuUser, href: "/profile" },
];

const DesktopMenu = ({ pathname, navigate }) => (
  <Box
    as="aside"
    bg="bg.primary"
    borderRight="1px solid"
    borderColor="brand.800/40"
    height="100%"
    px={8}
    display={{ base: "none", md: "block" }}
  >
    <VStack
      as="nav"
      maxW="container.2xl"
      mx="auto"
      px={2}
      pt={8}
      justify="space-between"
      align="center"
    >
      <HStack gap="3" mb={10}>
        <Box py={2} px={2.5} borderRadius="xl" bg="brand.600">
          <Icon as={LuLeaf} boxSize={5} color="text.primary" />
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color="text.primary">
          HydroGrow
        </Text>
      </HStack>
      <VStack
        as="ul"
        gap={10}
        listStyleType="none"
        flex="1"
        justify="flex-start"
        w="100%"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <HStack
              as="li"
              key={item.href}
              w="100%"
              gap={4}
              px={4}
              py={3}
              borderRadius="lg"
              bg={isActive ? "brand.400" : "transparent"}
              transition="all 0.3s ease"
              _hover={{
                bg: "brand.600/80",
              }}
              cursor="pointer"
              onClick={() => navigate(item.href)}
            >
              <Icon
                as={item.icon}
                color={isActive ? "text.primary" : "text.secondary"}
                transition="all 0.3s ease"
              />
              <ChakraLink
                as="span"
                fontSize="sm"
                fontWeight={isActive ? "600" : "500"}
                color={isActive ? "text.primary" : "text.secondary"}
                _hover={{ textDecoration: "none" }}
                transition="all 0.3s ease"
                w="100%"
              >
                {item.label}
              </ChakraLink>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  </Box>
);

const MobileMenu = ({ pathname, navigate }) => (
  <Box
    display={{ base: "block", md: "none" }}
    position="fixed"
    bottom="0"
    left="0"
    right="0"
    zIndex="100"
    p={4}
    bgGradient="to-t"
    gradientFrom="brand.900"
    gradientTo="transparent"
    pointerEvents="none"
  >
    <GlassCard
      as={Flex}
      justifyContent="space-around"
      alignItems="center"
      p={2}
      px={4}
      mb={0}
      w="100%"
      flexDirection="row"
      borderRadius="3xl"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 20px 50px rgba(0,0,0,0.5)"
      bg="brand.900/90"
      backdropFilter="blur(20px)"
      pointerEvents="auto"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Flex
            key={item.href}
            direction="column"
            align="center"
            justify="center"
            w="14"
            h="14"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            cursor="pointer"
            onClick={() => navigate(item.href)}
            position="relative"
            color={isActive ? "white" : "text.secondary"}
            px={2}
          >
            {isActive && (
              <>
              <Box
                position="absolute"
                top="-6"
                w="14"
                h="14"
                bg="brandSecondary.500"
                borderRadius="full"
                boxShadow="0 10px 20px rgba(64, 145, 108, 0.4)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="4px solid"
                borderColor="brand.900"
              >
                <Icon as={item.icon} boxSize={6} />
              </Box>
                <Text mt={6} fontSize="md" fontWeight="medium">
                  {item.label}
                </Text>
              </>
            )}
            {!isActive && (
              <>
                <Icon as={item.icon} boxSize={5} mb={1} />
                <Text fontSize="xs" fontWeight="medium" opacity="0.8">
                  {item.label}
                </Text>
              </>
            )}
          </Flex>
        );
      })}
    </GlassCard>
  </Box>
);

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <DesktopMenu pathname={location.pathname} navigate={navigate} />
      <MobileMenu pathname={location.pathname} navigate={navigate} />
    </>
  );
};

export default Menu;

