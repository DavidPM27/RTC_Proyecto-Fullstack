import { NumberInput } from "@chakra-ui/react";
import { forwardRef } from "react";

const NumericInput = forwardRef(({ placeholder, value, onChange, name, ...props }, ref) => {
  return (
    <NumberInput.Root 
      value={value !== undefined ? String(value) : undefined}
      onValueChange={(details) => {
        if (onChange) {
          onChange({
            target: {
              name: name,
              value: details.value,
            },
          });
        }
      }}
      min={0}
      {...props}
    >
      <NumberInput.Control border="1px solid" borderColor="brand.600" borderRadius="xl" bg="brand.900">
        <NumberInput.IncrementTrigger />
        <NumberInput.DecrementTrigger borderColor="brand.600" _focus={{
            bg: "brand.600",
            focusRingColor: "brand.500",
        }}/>
      </NumberInput.Control>
      <NumberInput.Input 
        ref={ref}
        name={name}
        border="1px solid" 
        borderColor="brand.600" 
        borderRadius="xl" 
        bg="brand.900" 
        color="text.primary" 
        placeholder={placeholder}
        _focus={{
          borderColor: "brand.500",
          focusRingColor: "brand.500",
        }}
      />
    </NumberInput.Root>
  );
});

NumericInput.displayName = "NumericInput";

export default NumericInput;