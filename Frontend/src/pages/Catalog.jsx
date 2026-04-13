import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Icon,
  Grid,
  Container,
  Stack,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../utils/capitalize";
import Menu from "../components/layout/Menu";
import GlassCard from "../components/ui/GlassCard";
import { fetchPlants } from "../api/plantsApi";

const Catalog = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async () => {
    const query = inputRef.current.value.trim().toLowerCase();
    if (!query) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const allPlants = await fetchPlants();
      const results = allPlants.filter((plant) => {
        const matchesCommon = plant.common_name
          ?.toLowerCase()
          .includes(query);
        const matchesScientific = plant.scientific_name
          ?.toLowerCase()
          .includes(query);
        return matchesCommon || matchesScientific;
      });
      setPlants(results);
    } catch (error) {
      console.error(error);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  if (hasSearched) {
    return (
      <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
        <Menu />
        <Box bg="brand.900" flex="1" py={8} pb={{ base: 32, md: 8 }}>
          <Container maxW="container.xl">
            <Box mb={8}>
              <Box
                p={2}
                borderRadius="2xl"
                bg="rgba(255, 255, 255, 0.05)"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="xl"
                maxW="2xl"
              >
                <Flex gap={2} direction={{ base: "column", sm: "row" }}>
                  <Box position="relative" w="100%">
                    <Box
                      position="absolute"
                      left="4"
                      top="50%"
                      transform="translateY(-50%)"
                      color="brand.200"
                    >
                      <Icon as={FiSearch} boxSize={5} />
                    </Box>
                    <Input
                      ref={inputRef}
                      placeholder="E.g.: Monstera, Pothos..."
                      pl="12"
                      h="14"
                      bg="transparent"
                      border="none"
                      color="white"
                      _placeholder={{ color: "brand.300" }}
                      _focus={{ boxShadow: "none", border: "none" }}
                      fontSize="lg"
                    />
                  </Box>
                  <Flex gap={2}>
                    <Button
                      flex={{ base: 1, sm: "initial" }}
                      h="14"
                      px={8}
                      bg="brandSecondary.500"
                      color="white"
                      borderRadius="xl"
                      _hover={{
                        bg: "brandSecondary.400",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                      onClick={handleSearch}
                      isLoading={loading}
                    >
                      Search
                    </Button>
                    <Button
                      flex={{ base: 1, sm: "initial" }}
                      h="14"
                      px={8}
                      bg="whiteAlpha.200"
                      color="white"
                      borderRadius="xl"
                      _hover={{ bg: "whiteAlpha.300" }}
                      transition="all 0.2s"
                      onClick={() => {
                        setHasSearched(false);
                        setPlants([]);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                    >
                      Close
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            <Heading size="md" color="brand.50" mb={6}>
              {plants.length} Results
            </Heading>

            {loading ? (
              <Flex justify="center" align="center" h="300px">
                <Spinner color="brandSecondary.500" size="xl" />
              </Flex>
            ) : plants.length > 0 ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                }}
                gap={6}
              >
                {plants.map((plant) => (
                  <GlassCard
                    key={plant._id}
                    borderRadius="2xl"
                    overflow="hidden"
                    transition="all 0.3s"
                    p={0}
                    mb={0}
                    _hover={{
                      transform: "translateY(-8px)",
                    }}
                    onClick={() => navigate(`/plant/${plant._id}`)}
                    cursor="pointer"
                  >
                    <Box position="relative" overflow="hidden" h="250px">
                      <Image
                        w="100%"
                        h="100%"
                        src={
                          plant.default_image ||
                          "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop"
                        }
                        objectFit="cover"
                        transition="transform 0.3s"
                        _groupHover={{ transform: "scale(1.1)" }}
                      />
                    </Box>
                    <Box p={4}>
                      <Heading size="md" color="brand.50" noOfLines={1} mb={1}>
                        {capitalize(
                          plant.common_name || plant.scientific_name
                        )}
                      </Heading>
                      <Text
                        fontSize="xs"
                        color="text.secondary"
                        noOfLines={1}
                        fontStyle="italic"
                      >
                        {plant.scientific_name}
                      </Text>
                    </Box>
                  </GlassCard>
                ))}
              </Grid>
            ) : (
              <Flex
                justify="center"
                align="center"
                h="300px"
                flexDirection="column"
              >
                <Text color="brand.200" fontSize="lg">
                  No plants found
                </Text>
              </Flex>
            )}
          </Container>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
      <Menu />
      <Box
        as="section"
        bg="brand.900"
        flex="1"
        position="relative"
        overflow="hidden"
        display="flex"
        alignItems="center"
        py={{ base: 12, md: 0 }}
        pb={{ base: 32, md: 0 }}
      >
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="600px"
          h="600px"
          bg="brandSecondary.500"
          filter="blur(150px)"
          opacity="0.2"
          borderRadius="full"
          zIndex="0"
        />

        <Container maxW="container.xl" zIndex="1">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={10}
            alignItems="center"
          >
            <Stack spacing={8}>
              <Box maxW="lg">
                <Heading
                  as="h1"
                  size={{ base: "2xl", md: "3xl" }}
                  color="brand.50"
                  lineHeight="shorter"
                  letterSpacing="tight"
                >
                  Find the perfect <br />
                  <Text as="span" color="brandSecondary.300">
                    plant for you.
                  </Text>
                </Heading>
                <Text color="brand.200" fontSize="lg" mt={6} mb={6} maxW="md">
                  Explore over 5,000 species. Filter by light, water or care and
                  add life to your space.
                </Text>
              </Box>
              <Box
                p={2}
                borderRadius="2xl"
                bg="rgba(255, 255, 255, 0.05)"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="xl"
                maxW="lg"
              >
                <Flex gap={2} direction={{ base: "column", sm: "row" }}>
                  <Box position="relative" w="full">
                    <Box
                      position="absolute"
                      left="4"
                      top="50%"
                      transform="translateY(-50%)"
                      color="brand.200"
                    >
                      <Icon as={FiSearch} boxSize={5} />
                    </Box>
                    <Input
                      ref={inputRef}
                      placeholder="E.g.: Monstera, Pothos..."
                      pl="12"
                      h="14"
                      bg="transparent"
                      border="none"
                      color="white"
                      _placeholder={{ color: "brand.300" }}
                      _focus={{ boxShadow: "none", border: "none" }}
                      fontSize="lg"
                    />
                  </Box>
                  <Button
                    h="14"
                    px={8}
                    bg="brandSecondary.500"
                    color="white"
                    borderRadius="xl"
                    _hover={{
                      bg: "brandSecondary.400",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    onClick={handleSearch}
                    isLoading={loading}
                  >
                    Search
                  </Button>
                </Flex>
              </Box>
            </Stack>
            <Box
              position="relative"
              height={{ base: "300px", md: "500px", lg: "600px" }}
              display={{ base: "none", md: "block" }}
            >
              <Image
                w="100%"
                h="100%"
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop"
                objectFit="cover"
                borderRadius="3xl"
                boxShadow="2xl"
              />
            </Box>
          </Grid>
        </Container>
      </Box>
    </Flex>
  );
};

export default Catalog;

