import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
