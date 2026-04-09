import { Button } from "@chakra-ui/react";

const ButtonCustom = ({ variant = "primary", textValue, width = "full", ...props }) => {
  return variant === "primary" ? (
    <Button
      variant="solid"
      size="sm"
      width={width}
      borderRadius="xl"
      bg="brandSecondary.500"
      color="black"
      fontWeight="semibold"
      _hover={{
        bg: "brandSecondary.400",
        transform: "scale(1.02)",
      }}
      {...props}
    >
      {textValue}
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      width={width}
      borderRadius="xl"
      mt="2"
      bg="transparent"
      color="brand.200"
      fontWeight="semibold"
      _hover={{
        bg: "brand.700",
        color: "white",
        transform: "scale(1.02)",
      }}
      {...props}
    >
      {textValue}
    </Button>
  );
};

export default ButtonCustom;
