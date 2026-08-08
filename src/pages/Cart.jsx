import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  UPDATE_QUANTITY,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../redux/actionTypes";
import privateApi from "../config/privateApi";
import { useToast } from "../components/ToastProvider";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await privateApi.get("/cart");

      setCart(response.data.data || []);

      if (response.data.data.length === 0) {
        dispatch({
          type: CLEAR_CART,
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to load cart.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQuantity = async (item) => {
    try {
      await privateApi.patch(`/cart/${item.id}`, {
        quantity: item.quantity + 1,
      });

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        )
      );
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to update quantity.",
        type: "error",
      });
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await privateApi.patch(`/cart/${item.id}`, {
        quantity: item.quantity - 1,
      });

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              }
            : cartItem
        )
      );
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to update quantity.",
        type: "error",
      });
    }
  };

  const removeItem = async (item) => {
    try {
      await privateApi.delete(`/cart/${item.id}`);

      setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));

      dispatch({
        type: REMOVE_FROM_CART,
        payload: item.product.id,
      });

      showToast({
        title: "Removed",
        description: `${item.name} removed from cart.`,
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to remove item.",
        type: "error",
      });
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  if (loading) {
    return (
      <Box p={10} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
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
                  <HStack justify="space-between">
                    <HStack gap={4}>
                      <Image
                        src={
                          item.product.image ||
                          "https://placehold.co/400x300?text=No+Image"
                        }
                        boxSize="100px"
                        objectFit="cover"
                      />

                      <Box>
                        <Heading size="md">{item.product.name}</Heading>

                        <Text>₹{item.product.price}</Text>
                      </Box>
                    </HStack>

                    <VStack>
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
              <Heading size="md">Total: ₹{total.toFixed(2)}</Heading>

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
  );
}

export default Cart;
