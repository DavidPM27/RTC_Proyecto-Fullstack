import { memo, useMemo } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { capitalize } from "../../utils/capitalize";
import {
  getOptimizedImageUrl,
  getPlaceholderUrl,
} from "../../utils/cloudinaryOptimize";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop";

// Plant card optimized for large lists.
const PlantCard = memo(({ plant, onClick }) => {
  const rawSrc = plant.default_image || FALLBACK_IMAGE;

  // Memo so transformation don't recompute on every render
  const optimizedSrc = useMemo(
    () => getOptimizedImageUrl(rawSrc, { width: 400, quality: 40 }),
    [rawSrc]
  );
  const placeholderSrc = useMemo(() => getPlaceholderUrl(rawSrc), [rawSrc]);

  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      transition="transform 0.3s, box-shadow 0.3s"
      role="group"
      cursor="pointer"
      onClick={onClick}
      bg="brand.800/60"
      border="1px solid"
      borderColor="brand.600"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}
      css={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 380px",
      }}
    >
      {/* Image container */}
      <Box position="relative" overflow="hidden" h="280px">
        <LazyLoadImage
          src={optimizedSrc}
          alt={plant.common_name || plant.scientific_name}
          placeholderSrc={placeholderSrc}
          width="100%"
          height="280"
          wrapperProps={{
            style: {
              width: "100%",
              height: "100%",
              display: "block",
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      {/* Text content */}
      <Box p={5}>
        <Heading
          size="md"
          color="brand.50"
          noOfLines={1}
          mb={1}
          fontWeight="semibold"
        >
          {capitalize(plant.common_name || plant.scientific_name)}
        </Heading>
        <Text
          fontSize="xs"
          color="brand.300"
          noOfLines={1}
          fontStyle="italic"
        >
          {plant.scientific_name}
        </Text>
      </Box>
    </Box>
  );
});

PlantCard.displayName = "PlantCard";

export default PlantCard;
