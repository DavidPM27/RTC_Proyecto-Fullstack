import {
  Dialog,
  Portal,
  CloseButton,
  Stack,
  Button,
  Icon,
  Menu,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { LuX, LuSearch, LuLeaf } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import AddPlant from "../../pages/AddPlant";
import ButtonCustom from "../ui/ButtonCustom";
import { useGarden } from "../../hooks/useGarden";
import { isAdmin } from "../../utils/auth";

const PlantDialog = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const { addPlant } = useGarden();
  const navigate = useNavigate();
  const admin = isAdmin();

  const handleAddPlant = (plantData) => {
    addPlant(plantData);
  };

  return (
    <>
      {admin ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <div>
              <ButtonCustom variant="primary" textValue="+ Add Plant" width="8rem" />
            </div>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="bg.primary"
                border="1px solid"
                borderColor="brand.600"
                borderRadius="xl"
                boxShadow="lg"
                minW="180px"
              >
                <Menu.Item
                  value="existing"
                  color="text.primary"
                  _hover={{ bg: "brand.700" }}
                  borderRadius="lg"
                  gap={2}
                  onClick={() => navigate("/catalog")}
                >
                  <Icon as={LuSearch} boxSize={4} color="brandSecondary.400" />
                  Add existing plant
                </Menu.Item>
                <Menu.Item
                  value="new"
                  color="text.primary"
                  _hover={{ bg: "brand.700" }}
                  borderRadius="lg"
                  gap={2}
                  onClick={onOpen}
                >
                  <Icon as={LuLeaf} boxSize={4} color="brandSecondary.400" />
                  Add new plant
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <ButtonCustom
          variant="primary"
          textValue="+ Add Plant"
          width="8rem"
          onClick={() => navigate("/catalog")}
        />
      )}

      <Dialog.Root open={open} onOpenChange={(e) => (e.open ? onOpen() : onClose())}>
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
    </>
  );
};

export default PlantDialog;
