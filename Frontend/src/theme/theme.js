// Importamos createSystem y defineConfig de Chakra
import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

// Usamos defineConfig para crear nuestro tema.
const customConfig = defineConfig({
  theme: {
    breakpoints: {
      base: "350px", // tamaño para móviles
      sm: "480px", // tamaño para tabletas
      md: "768px", // tamaño para laptops
      lg: "1024px", // tamaño para pantallas grandes
      xl: "1280px", // tamaño extra grande
    },
    tokens: {
      colors: {
        brand: {
          50: "#e6f4ea",
          100: "#c0e4cb",
          200: "#99d4ac",
          300: "#73c48d",
          400: "#40916C",
          500: "#406e5a",
          600: "#325647",
          700: "#253f33",
          800: "#1b4332", // Default
          900: "#0e221a",
        },
        brandSecondary: {
          50: "#f9f5f2",
          100: "#f0e0d6",
          200: "#f7d6c4",
          300: "#f4c9b1",
          400: "#e2b8a8",
          500: "#D4A373", // Default
          600: "#B5835A",
          700: "#9C4221",
          800: "#7B341E",
          900: "#652B19",
        },
        brandTertiary: {
          50: "#F8FFEC",
          100: "#EBFFD2",
          200: "#D9EDC0",
          300: "#C7DBAE",
          400: "#B5C99C",
          500: "#A3B18A", // Default
          600: "#8F9E7F",
          700: "#7B8C6F",
          800: "#677B5F",
          900: "#53694F",
        },
        bg: {
          primary: "#081c15",
          secondary: "#1b4332",
        },
        text: {
          primary: "#f8f9f1",
          secondary: "#A3B18A",
          highlight: "#081C15",
        },
        border: {
          primary: "#2d5a27",
        },
        state: {
          success: "#52b788",
          alert: "#e76f51",
          warning: "#ffb703",
        },
      },
      fonts: {
        heading: `'Roboto', sans-serif`,
        body: `'Inter', sans-serif`,
      },
    },
  },
});

// Usamos createSystem para crear la configuración que le pasaremos como valor al proveedor
export const system = createSystem(defaultConfig, customConfig);
