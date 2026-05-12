import { useState } from "react";
import {
  Stack,
  HStack,
  Box,
  FileUpload,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import FieldForm from "../components/common/FieldForm";
import ButtonCustom from "../components/ui/ButtonCustom";
import TextInput from "../components/ui/TextInput";
import NumericInput from "../components/ui/NumberInput";
import DateInput from "../components/ui/DateInput";

const AddPlant = ({ onAddPlant, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      nickname: "",
      species: "",
      plantedAt: new Date().toISOString().split('T')[0],
      wateringFrequency: 7,
      imagePreview: "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const imagePreview = watch("imagePreview");

  const onSubmit = (data) => {
    const plantData = {
      name: data.nickname,
      species: data.species || data.nickname,
      imageFile,
      category: "Custom Plant",
      stats: {
        plantedAt: data.plantedAt,
        lastWatered: new Date().toISOString(),
        wateringFrequency: parseInt(data.wateringFrequency) || 7,
      },
      requirements: {
        minTemp: 10,
        maxTemp: 30,
        idealPh: 6.0,
      },
    };

    onAddPlant(plantData);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setValue("imagePreview", event.target?.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4" w="full">
        <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
          <FileUpload.HiddenInput onChange={handleFileChange} />
          <FileUpload.Dropzone
            bg="brand.900"
            borderRadius="md"
            border="2px dashed"
            borderColor={imagePreview ? "brand.500" : "brand.600"}
            p="4"
            transition="all 0.3s ease"
            _hover={{ borderColor: "brand.500", bg: "brand.800/40" }}
          >
            <Icon size="md" color={imagePreview ? "brand.500" : "fg.muted"}>
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box color="text.secondary">
                {imagePreview ? "Image uploaded!" : "Upload photo"}
              </Box>
              <Box color="brandTertiary.900" fontSize="xs">
                .png, .jpg up to 5MB
              </Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.List />
        </FileUpload.Root>

        <FieldForm label="Name / Nickname" error={errors.nickname}>
          <TextInput 
            placeholder="e.g. My Favorite Fern"
            {...register("nickname", { 
              required: "Please enter a name or species",
              minLength: { value: 2, message: "Name is too short" }
            })} 
          />
        </FieldForm>

        <FieldForm label="Scientific name" error={errors.species}>
          <TextInput 
            placeholder="e.g. Nephrolepis exaltata"
            {...register("species")} 
          />
        </FieldForm>

        <HStack spacing="4" w="full" align="flex-start">
          <Box flex="1">
            <FieldForm label="Date of birth" error={errors.plantedAt}>
              <DateInput 
                {...register("plantedAt", { required: "Date is required" })} 
              />
            </FieldForm>
          </Box>
          <Box flex="1">
            <FieldForm label="Water (days)" error={errors.wateringFrequency}>
              <NumericInput 
                placeholder="7"
                {...register("wateringFrequency", { 
                  required: "Frequency is required",
                  min: { value: 1, message: "Must be at least 1 day" }
                })} 
              />
            </FieldForm>
          </Box>
        </HStack>

        <ButtonCustom 
          variant="primary" 
          textValue="Add to garden" 
          width="full"
          disabled={!isDirty}
          type="submit"
        />
      </Stack>
    </form>
  );
};

export default AddPlant;
