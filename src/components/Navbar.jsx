import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const cart = useSelector((state) => state.cart);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const logout = () => {
    localStorage.removeItem("user");
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
          _hover={{
            bg: "blue.500",
          }}
        >
          Home
        </Button>

        <Button
          as={Link}
          to="/cart"
          variant="ghost"
          color="white"
          _hover={{
            bg: "blue.500",
          }}
        >
          Cart
          <Badge ml={2} colorPalette="red">
            {cartCount}
          </Badge>
        </Button>

        <Text>Hi, {user?.name}</Text>

        <Button colorPalette="red" size="sm" onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
}

export default Navbar;
