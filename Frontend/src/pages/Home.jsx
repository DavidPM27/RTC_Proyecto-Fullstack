import {
  Box,
  HStack,
  Text,
  VStack,
  Grid,
  GridItem,
  Spinner,
  Card,
  Icon,
  Flex,
  Stack
} from "@chakra-ui/react";
import { useGarden } from "../hooks/useGarden";
import PlantCard from "../components/common/PlantCard";
import Menu from "../components/layout/Menu";
import PlantDialog from "../components/common/PlantDialog";
import { LuCloudSun, LuDroplets, LuWind } from "react-icons/lu";
import GlassCard from "../components/ui/GlassCard";

const Home = () => {
  const { weather, weatherLoading, weatherError, myGarden, gardenLoading } = useGarden();

  if (weatherLoading || !weather) {
    return (
      <Flex as="main" minHeight="100vh" align="center" justify="center">
        <Spinner size="lg" color="brand.500" margin="auto" />
      </Flex>
    );
  }

  if (weatherError) return <Text color="red.400">{weatherError}</Text>;


  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh" bg="bg.primary">
      <Menu />
      <Box
        as="section"
        flex="1"
        px={{ base: 6, md: 10, lg: 32 }}
        py={8}
        pb={{ base: 32, md: 0 }} // Extra padding on mobile to not hide content behind the bottom nav
        w="100%"
      >
        <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }} mb={8} gap={4}>
          <VStack align="flex-start" spacing={0}>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="text.primary">
              Hello, Gardener 🍃
            </Text>
            <Text fontSize="lg" color="text.secondary">
              Here are your plants
            </Text>
          </VStack>
          <PlantDialog />
        </Stack>
        <GlassCard>
          <Card.Body display="flex" gap={6}>
            <Flex direction={{ base: "row" }} w="100%" justifyContent="space-between" gap={6}>
              <VStack alignItems="flex-start" flex="1">
                <Text fontSize="sm" color="text.secondary">
                  CURRENT WEATHER
                </Text>
                <HStack gap={6}>
                  <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold" color="text.primary">
                    {weather.temp}°C
                  </Text>
                  <Text fontSize="lg" color="text.secondary">
                    {weather.city}
                  </Text>
                </HStack>
                <Flex wrap="wrap" gap={4} mt={2}>
                  <HStack spacing={2}>
                    <Icon as={LuDroplets} boxSize={5} color="text.secondary" />
                    <Text fontSize="md" color="text.primary">
                      {weather.humidity}%
                    </Text>
                    <Text fontSize="md" color="text.secondary">
                      Humidity
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={LuWind} boxSize={5} color="text.secondary" />
                    <Text fontSize="md" color="text.primary">
                      {weather.wind} {weather.wind_unit}
                    </Text>
                    <Text fontSize="md" color="text.secondary">
                      Wind
                    </Text>
                  </HStack>
                </Flex>
              </VStack>
              
              <Flex align="center" justify={{ base: "center", md: "flex-end" }}>
                <Icon as={LuCloudSun} boxSize={{ base: 20, md: 28 }} color="brand.500" />
              </Flex>
            </Flex>
          </Card.Body>
        </GlassCard>
        <Text
          textAlign="left"
          fontSize="2xl"
          fontWeight="bold"
          color="text.primary"
          mb={6}
          mt={10}
        >
          My Plants
        </Text>
        {gardenLoading ? (
          <Flex justify="center" py={12}>
            <Spinner size="lg" color="brand.500" />
          </Flex>
        ) : myGarden.length === 0 ? (
          <Flex justify="center" py={12}>
            <Text fontSize="lg" color="text.secondary">
              No tienes plantas todavía. ¡Añade tu primera planta!
            </Text>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={8}
          >
            {myGarden.map((plant) => (
              <GridItem key={plant.id} display="flex">
                <PlantCard {...plant} />
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Flex>
  );
};

export default Home;

