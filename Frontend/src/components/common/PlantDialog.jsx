import {
  Dialog,
  Portal,
  CloseButton,
  Stack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import AddPlant from "../../pages/AddPlant";
import ButtonCustom from "../ui/ButtonCustom";
import { useGarden } from "../../hooks/useGarden";

const PlantDialog = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const { addPlant } = useGarden();

  const handleAddPlant = (plantData) => {
    addPlant(plantData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => e.open ? onOpen() : onClose()}>
      <Dialog.Trigger asChild>
        <div onClick={onOpen}>
          <ButtonCustom variant="primary" textValue="+ Add Plant" width="8rem" />
        </div>
      </Dialog.Trigger>
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
          >
            <Dialog.Header>
              <Stack gap="2">
                <Dialog.Title
                  fontSize="xl"
                  fontWeight="bold"
                  color="text.primary"
                >
                  New plant
                </Dialog.Title>

                <Dialog.Description
                  fontSize="sm"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Register the details of a new plant to your collection
                </Dialog.Description>
              </Stack>
            </Dialog.Header>
            <Dialog.Body pb="0">
              <AddPlant onAddPlant={handleAddPlant} onClose={onClose} />
            </Dialog.Body>
            <Dialog.Footer>
              <Stack w="full">
                <Dialog.ActionTrigger asChild>
                  <ButtonCustom variant="secondary" textValue="Cancel" onClick={onClose} />
                </Dialog.ActionTrigger>
              </Stack>
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
  );
};

export default PlantDialog;
