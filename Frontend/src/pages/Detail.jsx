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
  Dialog,
  Portal,
  CloseButton,
  HStack,
  Icon,
  Textarea,
  NativeSelect,
  FileUpload,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { LuX, LuUpload } from "react-icons/lu";
import { capitalize } from "../utils/capitalize";
import { isAdmin } from "../utils/auth";
import Menu from "../components/layout/Menu";
import { useGarden } from "../hooks/useGarden";
import {
  fetchPlantById,
  deletePlantFromCatalog,
  updatePlantInCatalog,
} from "../api/plantsApi";
import ButtonCustom from "../components/ui/ButtonCustom";
import FieldForm from "../components/common/FieldForm";
import TextInput from "../components/ui/TextInput";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPlant } = useGarden();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const admin = isAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  const openEdit = () => {
    reset({
      common_name: plant.common_name || "",
      scientific_name: plant.scientific_name || "",
      family: plant.family || "",
      cycle: plant.cycle || "",
      watering: plant.watering || "",
      sunlight: plant.sunlight || "",
      description: plant.description || "",
    });
    setEditImageFile(null);
    setEditImagePreview(plant.default_image || "");
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setEditImagePreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmitEdit = async (data) => {
    setSaving(true);
    try {
      const updated = await updatePlantInCatalog(plant._id, data, editImageFile);
      setPlant(updated);
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

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
              <FiArrowLeft style={{ marginRight: "8px" }} /> Back
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
            <FiArrowLeft style={{ marginRight: "8px" }} /> Explorer
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
                h={{ base: "280px", lg: "420px" }}
                maxH="420px"
                bg="brand.800/40"
                overflow="hidden"
                borderRadius="2xl"
              >
                <Image
                  src={
                    plant.default_image ||
                    "https://via.placeholder.com/500x500?text=No+Image"
                  }
                  objectFit="cover"
                  w="100%"
                  h="100%"
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
                      {capitalize(plant.common_name || plant.scientific_name)}
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
                        <Text
                          color="brand.300"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          mb={1}
                        >
                          Family
                        </Text>
                        <Text color="brand.50" fontSize="sm">
                          {plant.family}
                        </Text>
                      </Box>
                    )}

                    {plant.cycle && (
                      <Box>
                        <Text
                          color="brand.300"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          mb={1}
                        >
                          Cycle
                        </Text>
                        <Text color="brand.50" fontSize="sm">
                          {plant.cycle}
                        </Text>
                      </Box>
                    )}

                    {plant.watering && (
                      <Box>
                        <Text
                          color="brand.300"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          mb={1}
                        >
                          Watering
                        </Text>
                        <Text color="brand.50" fontSize="sm">
                          {plant.watering}
                        </Text>
                      </Box>
                    )}

                    {plant.sunlight && typeof plant.sunlight === "string" && (
                      <Box>
                        <Text
                          color="brand.300"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          mb={2}
                        >
                          Sunlight
                        </Text>
                        <Flex
                          wrap="wrap"
                          gap={2}
                          alignItems="center"
                          justifyContent="center"
                        >
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
                      <Text
                        color="brand.300"
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        mb={2}
                      >
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

                <Stack mt={10} gap={3}>
                  <Button
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
                    onClick={async () => {
                      const result = await addPlant(plant);
                      if (result?.success) {
                        navigate("/");
                      } else if (result?.duplicate) {
                        setDuplicateOpen(true);
                      }
                    }}
                  >
                    Add to my garden
                  </Button>

                  {admin && (
                    <Button
                      bg="whiteAlpha.100"
                      color="brand.50"
                      h="12"
                      borderRadius="2xl"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      _hover={{ bg: "whiteAlpha.200" }}
                      transition="all 0.2s"
                      fontSize="sm"
                      fontWeight="semibold"
                      onClick={openEdit}
                    >
                      Edit plant data
                    </Button>
                  )}

                  {admin && (
                    <Button
                      bg="red.600/20"
                      color="red.300"
                      h="12"
                      borderRadius="2xl"
                      border="1px solid"
                      borderColor="red.600/40"
                      _hover={{ bg: "red.600/35", borderColor: "red.500" }}
                      transition="all 0.2s"
                      fontSize="sm"
                      fontWeight="semibold"
                      onClick={() => setDeleteOpen(true)}
                    >
                      Delete plant from catalog
                    </Button>
                  )}
                </Stack>

                {/* Duplicate plant error dialog */}
                <Dialog.Root
                  open={duplicateOpen}
                  onOpenChange={(e) => setDuplicateOpen(e.open)}
                >
                  <Portal>
                    <Dialog.Backdrop
                      backdropFilter="blur(4px)"
                      bg="rgba(0,0,0,0.6)"
                    />
                    <Dialog.Positioner>
                      <Dialog.Content
                        p="0"
                        m="2rem"
                        borderRadius="2xl"
                        bg="bg.primary"
                        border="1px solid"
                        borderColor="brand.600"
                        maxW="400px"
                      >
                        <Dialog.Header>
                          <Stack gap="2">
                            <Dialog.Title
                              fontSize="xl"
                              fontWeight="bold"
                              color="text.primary"
                            >
                              Plant already in your garden
                            </Dialog.Title>
                            <Dialog.Description
                              fontSize="sm"
                              color="text.secondary"
                              fontWeight="medium"
                            >
                              <strong>
                                {capitalize(
                                  plant.common_name || plant.scientific_name,
                                )}
                              </strong>{" "}
                              is already in your garden. You cannot add it
                              twice.
                            </Dialog.Description>
                          </Stack>
                        </Dialog.Header>
                        <Dialog.Footer>
                          <ButtonCustom
                            variant="secondary"
                            textValue="Close"
                            onClick={() => setDuplicateOpen(false)}
                          />
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

                {/* Edit plant dialog */}
                <Dialog.Root
                  open={editOpen}
                  onOpenChange={(e) => setEditOpen(e.open)}
                >
                  <Portal>
                    <Dialog.Backdrop
                      backdropFilter="blur(4px)"
                      bg="rgba(0,0,0,0.6)"
                    />
                    <Dialog.Positioner>
                      <Dialog.Content
                        p="0"
                        m="2rem"
                        borderRadius="2xl"
                        bg="bg.primary"
                        border="1px solid"
                        borderColor="brand.600"
                        maxW="480px"
                        maxH="calc(100vh - 4rem)"
                        display="flex"
                        flexDirection="column"
                      >
                        <form
                          onSubmit={handleSubmit(onSubmitEdit)}
                          style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
                        >
                          <Dialog.Header>
                            <Stack gap="2">
                              <Dialog.Title
                                fontSize="xl"
                                fontWeight="bold"
                                color="text.primary"
                              >
                                Edit plant data
                              </Dialog.Title>
                              <Dialog.Description
                                fontSize="sm"
                                color="text.secondary"
                                fontWeight="medium"
                              >
                                Update the catalog information for this plant
                              </Dialog.Description>
                            </Stack>
                          </Dialog.Header>
                          <Dialog.Body overflowY="auto" minH="0">
                            <Stack gap="4">
                              <FieldForm label="Photo">
                                <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                                  <FileUpload.HiddenInput onChange={handleEditImageChange} />
                                  <FileUpload.Dropzone
                                    bg="brand.900"
                                    borderRadius="md"
                                    border="2px dashed"
                                    borderColor={editImagePreview ? "brand.500" : "brand.600"}
                                    p="4"
                                    transition="all 0.3s ease"
                                    _hover={{ borderColor: "brand.500", bg: "brand.800/40" }}
                                  >
                                    <Icon size="md" color={editImagePreview ? "brand.500" : "fg.muted"}>
                                      <LuUpload />
                                    </Icon>
                                    <FileUpload.DropzoneContent>
                                      <Box color="text.secondary">
                                        {editImagePreview ? "Image ready" : "Upload photo"}
                                      </Box>
                                      <Box color="brandTertiary.900" fontSize="xs">
                                        .png, .jpg up to 5MB
                                      </Box>
                                    </FileUpload.DropzoneContent>
                                  </FileUpload.Dropzone>
                                  <FileUpload.List />
                                </FileUpload.Root>
                              </FieldForm>
                              <FieldForm label="Common name" error={errors.common_name}>
                                <TextInput
                                  {...register("common_name", {
                                    required: "Common name is required",
                                  })}
                                />
                              </FieldForm>
                              <FieldForm label="Scientific name" error={errors.scientific_name}>
                                <TextInput
                                  {...register("scientific_name", {
                                    required: "Scientific name is required",
                                  })}
                                />
                              </FieldForm>
                              <FieldForm label="Family" error={errors.family}>
                                <TextInput {...register("family")} />
                              </FieldForm>
                              <FieldForm label="Cycle" error={errors.cycle}>
                                <TextInput {...register("cycle")} />
                              </FieldForm>
                              <FieldForm label="Watering" error={errors.watering}>
                                <TextInput {...register("watering")} />
                              </FieldForm>
                              <FieldForm label="Sunlight" error={errors.sunlight}>
                                <NativeSelect.Root>
                                  <NativeSelect.Field
                                    {...register("sunlight")}
                                    border="1px solid"
                                    borderColor="brand.600"
                                    borderRadius="xl"
                                    color="text.primary"
                                    bg="brand.900"
                                  >
                                    <option value="">Select sunlight</option>
                                    <option value="Full sun">Full sun</option>
                                    <option value="Part shade">Part shade</option>
                                    <option value="Shade">Shade</option>
                                    <option value="Indirect light">Indirect light</option>
                                  </NativeSelect.Field>
                                  <NativeSelect.Indicator />
                                </NativeSelect.Root>
                              </FieldForm>
                              <FieldForm label="Description" error={errors.description}>
                                <Textarea
                                  border="1px solid"
                                  borderColor="brand.600"
                                  borderRadius="xl"
                                  color="text.primary"
                                  bg="brand.900"
                                  rows={4}
                                  {...register("description")}
                                />
                              </FieldForm>
                            </Stack>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <HStack w="full" gap={3}>
                              <Dialog.ActionTrigger asChild>
                                <ButtonCustom 
                                  variant="secondary" 
                                  textValue="Cancel" 
                                  onClick={() => setEditOpen(false)}
                                  flex={1}
                                  mt={0}
                                />
                              </Dialog.ActionTrigger>
                              <ButtonCustom
                                variant="primary"
                                textValue="Save changes"
                                type="submit"
                                loading={saving}
                                flex={1}
                                color="text.primary"
                              />
                            </HStack>
                          </Dialog.Footer>
                        </form>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" disabled={saving}>
                            <Icon as={LuX} boxSize={6} color="brand.500" />
                          </CloseButton>
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>

                {/* Delete confirmation dialog */}
                <Dialog.Root
                  open={deleteOpen}
                  onOpenChange={(e) => setDeleteOpen(e.open)}
                >
                  <Portal>
                    <Dialog.Backdrop
                      backdropFilter="blur(4px)"
                      bg="rgba(0,0,0,0.6)"
                    />
                    <Dialog.Positioner>
                      <Dialog.Content
                        p="0"
                        m="2rem"
                        borderRadius="2xl"
                        bg="bg.primary"
                        border="1px solid"
                        borderColor="red.600/40"
                        maxW="400px"
                      >
                        <Dialog.Header>
                          <Stack gap="2">
                            <Dialog.Title
                              fontSize="xl"
                              fontWeight="bold"
                              color="text.primary"
                            >
                              Delete plant
                            </Dialog.Title>
                            <Dialog.Description
                              fontSize="sm"
                              color="text.secondary"
                              fontWeight="medium"
                            >
                              Are you sure you want to permanently delete{" "}
                              <strong>
                                {capitalize(
                                  plant.common_name || plant.scientific_name,
                                )}
                              </strong>{" "}
                              from the catalog? This will also remove it from
                              all users' gardens and cannot be undone.
                            </Dialog.Description>
                          </Stack>
                        </Dialog.Header>
                        <Dialog.Footer>
                          <HStack w="full" gap={3}>
                            <Button
                              flex={1}
                              bg="whiteAlpha.100"
                              color="text.primary"
                              borderRadius="xl"
                              _hover={{ bg: "whiteAlpha.200" }}
                              onClick={() => setDeleteOpen(false)}
                              disabled={deleting}
                            >
                              Cancel
                            </Button>
                            <Button
                              flex={1}
                              bg="red.600"
                              color="white"
                              borderRadius="xl"
                              _hover={{ bg: "red.700" }}
                              loading={deleting}
                              onClick={async () => {
                                setDeleting(true);
                                try {
                                  await deletePlantFromCatalog(plant._id);
                                  navigate("/catalog");
                                } catch {
                                  setDeleting(false);
                                  setDeleteOpen(false);
                                }
                              }}
                            >
                              Delete permanently
                            </Button>
                          </HStack>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" disabled={deleting}>
                            <Icon as={LuX} boxSize={6} color="brand.500" />
                          </CloseButton>
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
};

export default Detail;
