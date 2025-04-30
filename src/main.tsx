import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import i18n (needs to be before any component using translations)
import "./lib/i18n";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<App />);
