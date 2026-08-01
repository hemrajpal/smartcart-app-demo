import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_QUANTITY, REMOVE_FROM_CART } from "../redux/actionTypes";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {}, []);

  const increaseQuantity = (item) => {
    dispatch({
      type: UPDATE_QUANTITY,
      payload: {
        id: item.id,
        quantity: item.quantity + 1,
      },
    });
  };

  const decreaseQuantity = (item) => {
    dispatch({
      type: UPDATE_QUANTITY,
      payload: {
        id: item.id,
        quantity: item.quantity - 1,
      },
    });
  };

  const removeItem = (item) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: item.id,
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />

      <Box p={6}>
        <Heading mb={6}>Shopping Cart</Heading>

        {cart.length === 0 ? (
          <Card.Root>
            <Card.Body>
              <VStack gap={4}>
                <Text>Your cart is empty.</Text>

                <Button colorPalette="blue" onClick={() => navigate("/home")}>
                  Continue Shopping
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        ) : (
          <>
            <VStack gap={5} align="stretch">
              {cart.map((item) => (
                <Card.Root key={item.id}>
                  <Card.Body>
                    <HStack justify="space-between" align="center">
                      <HStack gap={4}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          boxSize="100px"
                          objectFit="cover"
                        />

                        <Box>
                          <Heading size="md">{item.title}</Heading>

                          <Text color="gray.500">{item.category}</Text>

                          <Text fontWeight="bold">${item.price}</Text>
                        </Box>
                      </HStack>

                      <VStack gap={3}>
                        <HStack>
                          <Button
                            size="sm"
                            onClick={() => decreaseQuantity(item)}
                          >
                            -
                          </Button>

                          <Text>{item.quantity}</Text>

                          <Button
                            size="sm"
                            onClick={() => increaseQuantity(item)}
                          >
                            +
                          </Button>
                        </HStack>

                        <Button
                          size="sm"
                          colorPalette="red"
                          onClick={() => removeItem(item)}
                        >
                          Remove
                        </Button>
                      </VStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </VStack>

            <Card.Root mt={8}>
              <Card.Body>
                <Heading size="md">Total: ${total.toFixed(2)}</Heading>

                <Button
                  mt={4}
                  colorPalette="green"
                  width="full"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </Button>
              </Card.Body>
            </Card.Root>
          </>
        )}
      </Box>
    </>
  );
}

export default Cart;
