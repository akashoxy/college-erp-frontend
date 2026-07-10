import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/accessibility.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider,} from "./context/ThemeContext.jsx";


import App from "./App.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop />
    <ThemeProvider>
      <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
