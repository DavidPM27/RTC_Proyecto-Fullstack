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
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../utils/capitalize";
import Menu from "../components/layout/Menu";
import GlassCard from "../components/ui/GlassCard";
import { fetchPlants } from "../api/plantsApi";

const Catalog = () => {
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef();
  const navigate = useNavigate();

  // Fetch all plants on mount
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const data = await fetchPlants();
        setAllPlants(data);
      } catch (error) {
        console.error(error);
        setAllPlants([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlants();
  }, []);

  // Filter plants based on search query
  const displayedPlants = useMemo(() => {
    if (!searchQuery) return allPlants;

    const q = searchQuery.toLowerCase();
    return allPlants.filter((plant) => {
      const matchesCommon = plant.common_name?.toLowerCase().includes(q);
      const matchesScientific = plant.scientific_name
        ?.toLowerCase()
        .includes(q);
      return matchesCommon || matchesScientific;
    });
  }, [allPlants, searchQuery]);

  const handleSearch = () => {
    const query = inputRef.current.value.trim();
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
      <Menu />
      <Box
        as="section"
        bg="brand.900"
        flex="1"
        position="relative"
        overflow="hidden"
        py={{ base: 12, md: 0 }}
        pb={{ base: 32, md: 0 }}
      >

        {/* ── Hero Section ── */}
        <Container maxW="container.xl" mt={16} mb={16} p={{ base: 6, md: 10 }} borderRadius="3xl" bg="brand.700">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={10}
            alignItems="center"
          >
            <Stack spacing={8} alignItems="center">
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
                      onKeyDown={handleKeyDown}
                    />
                  </Box>
                  <Flex gap={2}>
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
                    {searchQuery && (
                      <Button
                        h="14"
                        px={6}
                        bg="whiteAlpha.200"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "whiteAlpha.300" }}
                        transition="all 0.2s"
                        onClick={handleClearSearch}
                      >
                        Clear
                      </Button>
                    )}
                  </Flex>
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

        {/* ── Categories + Plants Grid ── */}
        <Container maxW="container.xl" px={{ base: 4, md: 8 }} pb={16}>

          <Flex
            justify="space-between"
            align="center"
            mb={8}
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Heading size="lg" color="brand.50" fontWeight="bold">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "All Plants"}
            </Heading>
          </Flex>

          {/* Results count */}
          {searchQuery && (
            <Text color="brand.300" mb={6} fontSize="sm">
              {displayedPlants.length} plant{displayedPlants.length !== 1 && "s"} found
            </Text>
          )}

          {/* Plants grid */}
          {loading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner color="brandSecondary.500" size="xl" />
            </Flex>
          ) : displayedPlants.length > 0 ? (
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
              {displayedPlants.map((plant) => (
                <GlassCard
                  key={plant._id}
                  borderRadius="2xl"
                  overflow="hidden"
                  transition="all 0.3s"
                  p={0}
                  mb={0}
                  role="group"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  }}
                  onClick={() => navigate(`/plant/${plant._id}`)}
                  cursor="pointer"
                >
                  <Box position="relative" overflow="hidden" h="280px">
                    <Image
                      w="100%"
                      h="100%"
                      src={
                        plant.default_image ||
                        "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop"
                      }
                      objectFit="cover"
                      transition="transform 0.5s ease"
                      _groupHover={{ transform: "scale(1.08)" }}
                    />
                    {/* Gradient overlay at bottom */}
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      h="50%"
                      bgGradient="linear(to-t, blackAlpha.700, transparent)"
                      pointerEvents="none"
                    />
                  </Box>
                  <Box p={5}>
                    <Heading
                      size="md"
                      color="brand.50"
                      noOfLines={1}
                      mb={1}
                      fontWeight="semibold"
                    >
                      {capitalize(
                        plant.common_name || plant.scientific_name
                      )}
                    </Heading>
                    <Text
                      fontSize="xs"
                      color="brand.300"
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
              gap={4}
            >
              <Text color="brand.200" fontSize="lg">
                No plants found
              </Text>
              {searchQuery && (
                <Button
                  size="sm"
                  bg="brandSecondary.500"
                  color="white"
                  borderRadius="xl"
                  _hover={{ bg: "brandSecondary.400" }}
                  onClick={handleClearSearch}
                >
                  Show all plants
                </Button>
              )}
            </Flex>
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default Catalog;
