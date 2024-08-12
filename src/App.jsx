import { useContext, useEffect, useState } from "react";
// import Product from "./Product";
import "./App.css";
import NavBar from "./components/NavBar";
import Cart from "./components/cart";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useSearchParams,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import axios from "axios";
import { SidebarContext } from "./contexts/SidebarContext";
import OrderSummary from "./pages/orderSummary";
import Dashboard from "./pages/dashboard";
import OrderDetails from "./pages/order";
import MyOrders from "./pages/userOrder";
import PrivateRoute from "./hooks/privateRoute";
import { AuthContext } from "./contexts/AuthContext";
function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_SERVER;
  const { setIsOpen } = useContext(SidebarContext);
  const { getUser } = useContext(AuthContext);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("cartopen") === "true") {
      setIsOpen(true);
    }
    getUser();
  }, [searchParams]);
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Routes */}
        <Route path="/paymentStatus" element={<OrderSummary />} />
        <Route
          path="/order/:id"
          element={
            <PrivateRoute
              element={<OrderDetails />}
              roles={["CUSTOMER", "ADMIN"]}
            />
          }
        />
        <Route
          path="/myOrders"
          element={
            <PrivateRoute
              element={<MyOrders />}
              roles={["CUSTOMER", "ADMIN"]}
            />
          }
        />

        {/* Admin-only Route */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} roles={["ADMIN"]} />}
        />
      </Routes>
      <Cart />
    </>
  );
}

export default App;
