import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Heading,
  HStack,
  Image,
  Portal,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CLEAR_CART } from "../redux/actionTypes";

import privateApi from "../config/privateApi";
import { useToast } from "../components/ToastProvider";

function Checkout() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [openAddressModal, setOpenAddressModal] = useState(false);

  const [loadingAddress, setLoadingAddress] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const fetchAddresses = async () => {
    try {
      setLoadingAddress(true);

      const response = await privateApi.get("/address/list");

      const list = response.data.data || [];

      setAddresses(list);

      const defaultAddress = list.find((item) => item.is_default === true);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (list.length > 0) {
        setSelectedAddress(list[0].id);
      }
    } catch (error) {
      console.log("Address error", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchCart = async () => {
    try {
      setLoadingCart(true);

      const response = await privateApi.get("/cart");

      setCart(response.data.data || []);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to load cart.",
        type: "error",
      });
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, []);

  const currentAddress = addresses.find((item) => item.id === selectedAddress);

  const selectAddress = (address) => {
    setSelectedAddress(address.id);

    setOpenAddressModal(false);
  };

  const placeOrder = async () => {
    if (!currentAddress) {
      showToast({
        title: "Address required",
        description: "Please select a delivery address",
        type: "error",
      });

      navigate("/account/address");
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        address_id: currentAddress.id,

        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await privateApi.post("/order/checkout", payload);

      dispatch({
        type: CLEAR_CART,
      });

      showToast({
        title: "Order placed",
        description: "Your order has been placed successfully",
        type: "success",
      });

      navigate("/success", {
        state: {
          order: response.data.order,
        },
      });
    } catch (error) {
      showToast({
        title: "Order failed",
        description: error.response?.data?.message || "Unable to place order",
        type: "error",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart || loadingAddress) {
    return (
      <Box py={20} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <>
      <Box p={6}>
        <Heading mb={6}>Checkout</Heading>

        <HStack
          align="start"
          gap={8}
          flexDirection={{
            base: "column",
            md: "row",
          }}
        >
          {/* DELIVERY ADDRESS */}

          <Card.Root flex="1">
            <Card.Body>
              <VStack align="stretch" gap={5}>
                <Heading size="md">Delivery Address</Heading>

                {loadingAddress && (
                  <Box display="flex" justifyContent="center" py={5}>
                    <Spinner />
                  </Box>
                )}

                {!loadingAddress && currentAddress && (
                  <Card.Root
                    borderWidth="1px"
                    borderColor="blue.400"
                    bg="blue.50"
                  >
                    <Card.Body>
                      <HStack justify="space-between" align="start">
                        <Box>
                          <Text fontWeight="bold">{currentAddress.name}</Text>

                          <Text>Phone: {currentAddress.phone}</Text>

                          <Text>{currentAddress.address_line_1}</Text>

                          {currentAddress.address_line_2 && (
                            <Text>{currentAddress.address_line_2}</Text>
                          )}

                          <Text>
                            {currentAddress.city}, {currentAddress.state}
                            {" - "}
                            {currentAddress.postal_code}
                          </Text>

                          <Text>{currentAddress.country}</Text>
                        </Box>

                        {currentAddress.is_default === true && (
                          <Badge colorPalette="green">Default</Badge>
                        )}
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                )}

                {!loadingAddress && !currentAddress && (
                  <Text>No address selected</Text>
                )}

                <Button
                  variant="outline"
                  colorPalette="blue"
                  onClick={() => setOpenAddressModal(true)}
                >
                  Change Address
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => navigate("/account/address")}
                >
                  Manage Addresses
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* ORDER SUMMARY */}

          <Card.Root flex="1">
            <Card.Body>
              <Heading size="md" mb={4}>
                Order Summary
              </Heading>

              <VStack align="stretch" gap={4}>
                {cart.map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <HStack>
                      <Image
                        src={
                          item.product.image ||
                          "https://placehold.co/400x300?text=No+Image"
                        }
                        boxSize="60px"
                        objectFit="cover"
                      />

                      <Text>
                        {item.product.name}

                        {" x "}

                        {item.quantity}
                      </Text>
                    </HStack>

                    <Text>
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}

                <Heading size="md">Total: ₹{total.toFixed(2)}</Heading>

                <Button
                  colorPalette="green"
                  loading={placingOrder}
                  loadingText="Placing order..."
                  disabled={placingOrder || cart.length === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </HStack>
      </Box>

      {/* SELECT ADDRESS POPUP */}

      <Dialog.Root
        open={openAddressModal}
        onOpenChange={(e) => setOpenAddressModal(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Select Address</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  {addresses.map((address) => (
                    <Card.Root
                      key={address.id}
                      cursor="pointer"
                      borderWidth={
                        address.id === selectedAddress ? "2px" : "1px"
                      }
                      borderColor={
                        address.id === selectedAddress ? "blue.500" : "gray.200"
                      }
                      onClick={() => selectAddress(address)}
                    >
                      <Card.Body>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="bold">{address.name}</Text>

                            <Text>{address.address_line_1}</Text>

                            <Text>
                              {address.city}, {address.state}
                              {" - "}
                              {address.postal_code}
                            </Text>

                            <Text>Phone: {address.phone}</Text>
                          </Box>

                          {address.is_default === true && (
                            <Badge colorPalette="green">Default</Badge>
                          )}
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  ))}
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button onClick={() => setOpenAddressModal(false)}>
                  Close
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default Checkout;
