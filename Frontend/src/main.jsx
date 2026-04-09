import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
// Importamos nuestra configuración personalizada
import "./index.css";
import App from "./App.jsx";
import { system } from "./theme/theme.js";
import { GardenProvider } from "./context/GardenContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ChakraProvider value={system}>
        <GardenProvider>
          <App />
        </GardenProvider>
      </ChakraProvider>
    </StrictMode>
  </BrowserRouter>
);
