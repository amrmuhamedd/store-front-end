import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import CartProvider from "./contexts/CartContext";
import SidebarProvider from "./contexts/SidebarContext";
import AuthProvider from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <SidebarProvider>
        <AuthProvider>
          <Router>
            <App />
          </Router>
        </AuthProvider>
      </SidebarProvider>
    </CartProvider>
  </StrictMode>
);
