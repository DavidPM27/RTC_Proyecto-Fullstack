import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Spinner,
  Flex,
  Badge,
  Button,
  Grid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { capitalize } from "../utils/capitalize";
import Menu from "../components/layout/Menu";
import { useGarden } from "../hooks/useGarden";
import { fetchPlantById } from "../api/plantsApi";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPlant } = useGarden();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlant = async () => {
      try {
        const found = await fetchPlantById(id);
        if (found) {
          setPlant(found);
        } else {
          setError("Plant not found");
        }
      } catch (err) {
        setError("Error loading plant");
      } finally {
        setLoading(false);
      }
    };
    loadPlant();
  }, [id]);

  if (loading) {
    return (
      <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
        <Menu />
        <Box
          bg="brand.900"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="brandSecondary.500" size="xl" />
        </Box>
      </Flex>
    );
  }

  if (error || !plant) {
    return (
      <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
        <Menu />
        <Box bg="brand.900" flex="1" py={8}>
          <Container maxW="container.xl">
            <Button
              mb={6}
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={() => navigate("/catalog")}
            >
              <FiArrowLeft style={{ marginRight: '8px' }} /> Back
            </Button>
            <Text color="brand.200" fontSize="lg">
              {error || "Plant not found"}
            </Text>
          </Container>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
      <Menu />
      <Box
        bg="brand.900"
        flex="1"
        py={{ base: 8, md: 12 }}
        pb={{ base: 32, md: 12 }}
        position="relative"
        overflow="hidden"
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

        <Container maxW="container.lg" zIndex="1" position="relative">
          {/* Back button */}
          <Button
            size="sm"
            mb={6}
            bg="whiteAlpha.100"
            color="white"
            borderRadius="full"
            px={5}
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft style={{ marginRight: '8px' }} /> Explorer
          </Button>

          {/* Card principal */}
          <Box
            borderRadius="3xl"
            overflow="hidden"
            bg="whiteAlpha.10"
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Flex direction={{ base: "column", lg: "row" }} align="stretch">
              {/* Image box */}
              <Box 
                flex="1" 
                maxH={{ base: "400px", lg: "auto" }} 
                bg="brand.800/40"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <Image
                  src={
                    plant.default_image ||
                    "https://via.placeholder.com/500x500?text=No+Image"
                  }
                  objectFit="contain"
                  maxH="100%"
                  borderRadius="2xl"
                  alt={plant.common_name}
                />
              </Box>

              {/* Info box */}
              <Box
                flex="1.2"
                p={{ base: 6, md: 10 }}
                display="flex"
                flexDirection="column"
              >
                <Stack spacing={8}>
                  <Box>
                    <Heading
                      as="h1"
                      size={{ base: "xl", md: "2xl" }}
                      color="brand.50"
                      mb={2}
                    >
                      {capitalize(
                        plant.common_name || plant.scientific_name
                      )}
                    </Heading>
                    <Text
                      color="brandSecondary.500"
                      fontSize="lg"
                      fontStyle="italic"
                    >
                      {plant.scientific_name}
                    </Text>
                  </Box>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    {plant.family && (
                      <Box>
                        <Text color="brand.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={1}>
                          Family
                        </Text>
                        <Text color="brand.50" fontSize="sm">{plant.family}</Text>
                      </Box>
                    )}

                    {plant.cycle && (
                      <Box>
                        <Text color="brand.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={1}>
                          Cycle
                        </Text>
                        <Text color="brand.50" fontSize="sm">{plant.cycle}</Text>
                      </Box>
                    )}

                    {plant.watering && (
                      <Box>
                        <Text color="brand.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={1}>
                          Watering
                        </Text>
                        <Text color="brand.50" fontSize="sm">{plant.watering}</Text>
                      </Box>
                    )}

                  {plant.sunlight && typeof plant.sunlight === "string" && (
                      <Box>
                        <Text color="brand.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                          Sunlight
                        </Text>
                        <Flex wrap="wrap" gap={2} alignItems="center" justifyContent="center">
                          <Badge
                            bg="brandSecondary.500/20"
                            color="brandSecondary.300"
                            border="1px solid"
                            borderColor="brandSecondary.500/30"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            textTransform="capitalize"
                          >
                            {plant.sunlight}
                          </Badge>
                        </Flex>
                      </Box>
                    )}

                  </Grid>

                  {plant.description && (
                    <Box>
                      <Text color="brand.300" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                        Description
                      </Text>
                      <Text
                        color="brand.100"
                        lineHeight="relaxed"
                        fontSize="sm"
                        noOfLines={6}
                      >
                        {plant.description}
                      </Text>
                    </Box>
                  )}
                </Stack>

                <Button
                  mt={10}
                  bg="brandSecondary.500"
                  color="white"
                  h="14"
                  borderRadius="2xl"
                  _hover={{
                    bg: "brandSecondary.400",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                  fontSize="md"
                  fontWeight="bold"
                  onClick={() => {
                    addPlant(plant);
                    navigate("/");
                  }}
                >
                  Add to my garden
                </Button>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
};

export default Detail;

