import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  Spacer,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth?.user;

  const cart = useSelector((state) => state.cart);

  const cartCount = cart.length;

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <Box bg="blue.600" color="white" px={6} py={4}>
      <Flex align="center" gap={4}>
        <Heading size="md">🛒 ShopCart</Heading>

        <Spacer />

        <Button
          as={Link}
          to="/home"
          variant="ghost"
          color="white"
          _hover={{ bg: "blue.500" }}
        >
          Home
        </Button>

        <Button
          as={Link}
          to="/cart"
          variant="ghost"
          color="white"
          _hover={{ bg: "blue.500" }}
        >
          Cart
          <Badge ml={2} colorPalette="red">
            {cartCount}
          </Badge>
        </Button>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost" color="white" _hover={{ bg: "blue.500" }}>
              👤 {user?.name}
            </Button>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="account" onClick={() => navigate("/account")}>
                My Account
              </Menu.Item>

              <Menu.Item value="orders" onClick={() => navigate("/orders")}>
                My Orders
              </Menu.Item>

              <Menu.Item
                value="address"
                onClick={() => navigate("/account/address")}
              >
                Addresses
              </Menu.Item>

              <Menu.Item
                value="password"
                onClick={() => navigate("/account/password")}
              >
                Change Password
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item value="logout" color="red.500" onClick={logout}>
                Logout
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Flex>
    </Box>
  );
}

export default Navbar;
