import { useEffect, useMemo, useState } from "react";
import { Stack, Combobox, useListCollection, useFilter } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import FieldForm from "./FieldForm";
import ButtonCustom from "../ui/ButtonCustom";
import DateInput from "../ui/DateInput";
import { fetchPlants } from "../../api/plantsApi";

const AddExistingPlant = ({ onAddPlant, onClose }) => {
  const [plants, setPlants] = useState([]);
  const { contains } = useFilter({ sensitivity: "base" });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      plantId: "",
      lastWatered: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    fetchPlants().then(setPlants).catch(() => setPlants([]));
  }, []);

  const items = useMemo(
    () =>
      plants.map((plant) => ({
        label: plant.common_name || plant.scientific_name,
        value: plant._id,
      })),
    [plants]
  );

  const { collection, filter, set } = useListCollection({
    initialItems: items,
    filter: contains,
  });

  useEffect(() => {
    set(items);
  }, [items, set]);

  const onSubmit = (data) => {
    onAddPlant({ _id: data.plantId, lastWatered: data.lastWatered });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4" w="full">
        <FieldForm label="Plant" error={errors.plantId}>
          <Controller
            name="plantId"
            control={control}
            rules={{ required: "Please select a plant" }}
            render={({ field }) => (
              <Combobox.Root
                collection={collection}
                value={field.value ? [field.value] : []}
                onValueChange={(details) => field.onChange(details.value[0] || "")}
                onInputValueChange={(details) => filter(details.inputValue)}
                openOnClick
              >
                <Combobox.Control>
                  <Combobox.Input
                    placeholder="Search for a plant..."
                    border="1px solid"
                    borderColor="brand.600"
                    borderRadius="xl"
                    color="text.primary"
                    bg="brand.900"
                    _focus={{
                      borderColor: "brand.500",
                      focusRingColor: "brand.500",
                    }}
                  />
                  <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                  </Combobox.IndicatorGroup>
                </Combobox.Control>
                {/* ponytail: no Portal on purpose — keeps the dropdown inside
                    Dialog.Content's stacking context so it paints above the
                    modal without fighting its z-index. Dialog.Body has no
                    overflow, so nothing clips it. */}
                <Combobox.Positioner>
                  <Combobox.Content
                    bg="brand.900"
                    border="1px solid"
                    borderColor="brand.600"
                    borderRadius="xl"
                    boxShadow="lg"
                  >
                    <Combobox.Empty color="text.secondary" px="3" py="2">
                      No plants found
                    </Combobox.Empty>
                    {collection.items.map((item) => (
                      <Combobox.Item
                        key={item.value}
                        item={item}
                        color="text.primary"
                        borderRadius="lg"
                        _hover={{ bg: "brand.700" }}
                        _highlighted={{ bg: "brand.700" }}
                      >
                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Combobox.Root>
            )}
          />
        </FieldForm>

        <FieldForm label="Last watered" error={errors.lastWatered}>
          <DateInput
            {...register("lastWatered", { required: "Date is required" })}
          />
        </FieldForm>

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

export default AddExistingPlant;
