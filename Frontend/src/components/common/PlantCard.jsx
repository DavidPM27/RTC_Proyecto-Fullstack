import { useContext } from "react";
import {
  Image,
  Card,
  HStack,
  Icon,
  Dialog,
  Portal,
  CloseButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ButtonCustom from "../ui/ButtonCustom";
import { LuCircle, LuCircleX, LuDroplets, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { GardenContext } from "../../context/GardenContext";

const PlantCard = (plant) => {
  const navigate = useNavigate();
  const { removePlant } = useContext(GardenContext);
  const { open, onOpen, onClose } = useDisclosure();

  const handleRemovePlant = () => {
    removePlant(plant.id);
    onClose();
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const calculateWateringStatus = () => {
    if (!plant.stats?.lastWatered || !plant.stats?.wateringFrequency) {
      return { percentage: 0, text: "Unknown" };
    }

    const lastWateredDate = new Date(plant.stats.lastWatered);
    const now = new Date();
    
    // We get the difference in days gracefully
    const diffTime = now - lastWateredDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const freq = plant.stats.wateringFrequency;
    let percentage = Math.max(0, Math.round(((freq - diffDays) / freq) * 100));
    
    let text = "";
    if (diffDays >= freq) {
      percentage = 0;
      text = "Needs water today";
    } else {
      const daysLeft = freq - diffDays;
      text = `In ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    }
    
    return { percentage, text };
  };

  const wateringStatus = calculateWateringStatus();

  return (
    <>
      <Card.Root
        size="md"
        w="100%"
        overflow="hidden"
        borderRadius="2xl" 
        bg="brand.800/60"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="whiteAlpha.100"
        boxShadow="lg"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-5px)",
          borderColor: "brandTertiary.500",
          boxShadow: "xl",
        }}
      >
        <Image
          h="200px"
          objectFit="cover"
          aspectRatio="7/5"
          src={plant.imageUrl}
          alt={plant.species}
          filter="brightness(0.8)"
          _hover={{ filter: "brightness(1)" }}
          transition="0.3s"
        />

        <Icon 
          as={LuCircleX} 
          boxSize={6} 
          color="brand.500" 
          position="absolute" 
          top={2} 
          right={2} 
          cursor="pointer"
          onClick={handleIconClick}
          _hover={{ color: "red.400", transform: "scale(1.1)" }}
          transition="all 0.2s ease"
        />

        <Card.Body>
          <Card.Title
            fontSize="lg"
            fontWeight="bold"
            color="text.primary"
          >
            {plant.species}
          </Card.Title>

          <Card.Description
            fontSize="sm"
            color="text.secondary"
            fontWeight="medium"
          >
            Category: {plant.category}
          </Card.Description>
          <HStack mt={4} pb={4} spacing={2} borderBottom="1px solid" borderColor="brand.700">
            <Icon as={LuDroplets} boxSize={4} color="brand.500" />
            <Card.Description fontSize="xs" color="text.primary">
              {wateringStatus.percentage}%
            </Card.Description>
            <Icon as={LuCircle} boxSize={3} color="brandSecondary.500" />
            <Card.Description fontSize="xs" color="text.primary">
              {wateringStatus.text}
            </Card.Description>
          </HStack>
        </Card.Body>

        <Card.Footer>
          <ButtonCustom 
            variant="primary" 
            textValue="View Details" 
            onClick={() => navigate(`/plant/${plant.apiId}`)}
          />
        </Card.Footer>
      </Card.Root>

      {/* Confirmation dialog to remove plant */}
      <Dialog.Root open={open} onOpenChange={(e) => e.open ? onOpen() : onClose()}>
        <Portal>
          <Dialog.Backdrop backdropFilter="blur(4px)" bg="rgba(0, 0, 0, 0.6)" />
          <Dialog.Positioner>
            <Dialog.Content
              p="0"
              m="2rem"
              borderRadius="2xl"
              bg="bg.primary"
              border="1px solid"
              borderColor="brand.600"
              transition="all 0.3s ease"
              maxW="400px"
            >
              <Dialog.Header>
                <Stack gap="2">
                  <Dialog.Title
                    fontSize="xl"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    Remove plant
                  </Dialog.Title>

                  <Dialog.Description
                    fontSize="sm"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Are you sure you want to remove <strong>{plant.species}</strong> from your garden? This action cannot be undone.
                  </Dialog.Description>
                </Stack>
              </Dialog.Header>
              
              <Dialog.Footer>
                <HStack w="full" gap={3}>
                  <Dialog.ActionTrigger asChild>
                    <ButtonCustom 
                      variant="secondary" 
                      textValue="Cancel" 
                      onClick={onClose}
                      flex={1}
                      mt={0}
                    />
                  </Dialog.ActionTrigger>
                  <ButtonCustom 
                    variant="primary" 
                    textValue="Accept" 
                    onClick={handleRemovePlant}
                    flex={1}
                    color="text.primary"
                    bg="red.500"
                    _hover={{ bg: "red.600" }}
                  />
                </HStack>
              </Dialog.Footer>
              
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm">
                  <Icon as={LuX} boxSize={6} color="brand.500" />
                </CloseButton>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default PlantCard;

