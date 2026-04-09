import { Text, Box, Flex } from "@chakra-ui/react";
import Menu from "../components/layout/Menu";

const Default = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
      <Menu />
      <Box
        as="section"
        flex="1"
        px={{ base: 6, md: 10, lg: 40 }}
        py={8}
        w="100%"
        bg="bg.primary"
      >
        <Text fontSize="2xl" fontWeight="bold" color="text.primary">
          Unavailable page.
        </Text>
      </Box>
    </Flex>
  );
};

export default Default;

