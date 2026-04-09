import { Input } from "@chakra-ui/react";
import { forwardRef } from "react";

const TextInput = forwardRef(({ placeholder, ...props }, ref) => {
  return (
    <Input
        ref={ref}
        border="1px solid"
        borderColor="brand.600"
        borderRadius="xl"
        color="text.primary"
        bg="brand.900"
        placeholder={placeholder}
        {...props}
        _focus={{
            borderColor: "brand.500",
            focusRingColor: "brand.500",
        }}
    />
  )
})

TextInput.displayName = "TextInput";

export default TextInput