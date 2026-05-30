import { useState } from "react";
import {
  Dialog,
  Portal,
  CloseButton,
  Stack,
  Box,
  FileUpload,
  Icon,
  Text,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuX, LuUpload, LuUser } from "react-icons/lu";
import FieldForm from "./FieldForm";
import TextInput from "../ui/TextInput";
import ButtonCustom from "../ui/ButtonCustom";
import { updateUserProfile } from "../../api/authApi";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const EditProfileDialog = ({ user, onUserUpdated }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      imagePreview: user?.image || "",
    },
  });

  const imagePreview = watch("imagePreview");

  const handleOpen = () => {
    reset({
      username: user?.username || "",
      imagePreview: user?.image || "",
    });
    setImageFile(null);
    setServerError(null);
    onOpen();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue("imagePreview", event.target?.result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    const token = getToken();
    if (!token || !user?._id) return;

    const formData = new FormData();
    formData.append("username", data.username);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const updated = await updateUserProfile(user._id, formData, token);
      onUserUpdated(updated);
      onClose();
    } catch (err) {
      setServerError(err.message || "Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => (e.open ? handleOpen() : onClose())}>
      <Dialog.Trigger asChild>
        <div onClick={handleOpen}>
          <ButtonCustom variant="primary" textValue="Edit Profile" width="auto" />
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
                <Dialog.Title fontSize="xl" fontWeight="bold" color="text.primary">
                  Edit Profile
                </Dialog.Title>
                <Dialog.Description fontSize="sm" color="text.secondary" fontWeight="medium">
                  Update your username and profile picture
                </Dialog.Description>
              </Stack>
            </Dialog.Header>

            <Dialog.Body pb="0">
              <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4" w="full">
                  {/* Image upload with current avatar preview */}
                  <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                    <FileUpload.HiddenInput onChange={handleFileChange} />
                    <FileUpload.Dropzone
                      bg="brand.900"
                      borderRadius="md"
                      border="2px dashed"
                      borderColor={imageFile ? "brand.500" : "brand.600"}
                      p="4"
                      transition="all 0.3s ease"
                      _hover={{ borderColor: "brand.500", bg: "brand.800/40" }}
                    >
                      {imagePreview ? (
                        <Box
                          boxSize="64px"
                          borderRadius="full"
                          overflow="hidden"
                          flexShrink={0}
                          border="2px solid"
                          borderColor="brand.500"
                          mx="auto"
                        >
                          <img
                            src={imagePreview}
                            alt="preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </Box>
                      ) : (
                        <Flex
                          boxSize="64px"
                          borderRadius="full"
                          bg="brand.700"
                          alignItems="center"
                          justifyContent="center"
                          mx="auto"
                        >
                          <Icon as={LuUser} boxSize={8} color="text.secondary" />
                        </Flex>
                      )}
                      <FileUpload.DropzoneContent>
                        <Icon size="md" color={imageFile ? "brand.500" : "fg.muted"}>
                          <LuUpload />
                        </Icon>
                        <Box color="text.secondary">
                          {imageFile ? "Image selected!" : "Change profile photo"}
                        </Box>
                        <Box color="brandTertiary.900" fontSize="xs">
                          .png, .jpg up to 5MB
                        </Box>
                      </FileUpload.DropzoneContent>
                    </FileUpload.Dropzone>
                    <FileUpload.List />
                  </FileUpload.Root>

                  <FieldForm label="Username" error={errors.username}>
                    <TextInput
                      placeholder="Your username"
                      {...register("username", {
                        required: "Username is required",
                        minLength: { value: 2, message: "Username is too short" },
                      })}
                    />
                  </FieldForm>

                  {serverError && (
                    <Text fontSize="sm" color="state.alert">
                      {serverError}
                    </Text>
                  )}
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Stack w="full" gap={2}>
                <ButtonCustom
                  variant="primary"
                  textValue={submitting ? "" : "Save changes"}
                  width="full"
                  disabled={(!isDirty && !imageFile) || submitting}
                  type="submit"
                  form="edit-profile-form"
                >
                  {submitting && <Spinner size="sm" />}
                </ButtonCustom>
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

export default EditProfileDialog;
