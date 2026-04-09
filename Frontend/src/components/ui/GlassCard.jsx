import { Card } from "@chakra-ui/react";

const GlassCard = ({ children, ...props }) => {
  return (
    <Card.Root
      mb={8}
      p={4}
      bg="brand.800/60"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      border="1px solid"
      borderColor="brand.600"
      {...props}
    >
      {children}
    </Card.Root>
  );
};

export default GlassCard;
