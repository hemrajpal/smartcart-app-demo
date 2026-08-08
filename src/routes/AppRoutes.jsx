import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Account from "../pages/Account";
import Orders from "../pages/Orders";
import Addresses from "../pages/Addresses";
import ChangePassword from "../pages/ChangePassword";

import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Navbar */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/success" element={<OrderSuccess />} />

          <Route path="/account" element={<Account />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/account/address" element={<Addresses />} />

          <Route path="/account/password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
