import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Dialog,
  Portal,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { CLEAR_CART } from "../redux/actionTypes";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "9876543210",
      address: "12 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      zip: "700016",
      is_default: 1,
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "9123456780",
      address: "221B Baker Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      is_default: 0,
    },
    {
      id: 3,
      name: "Rahul Sharma",
      phone: "9988776655",
      address: "45 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560001",
      is_default: 0,
    },
  ]);

  const defaultAddress = addresses.find((item) => item.is_default === 1);

  const [selectedAddress, setSelectedAddress] = useState(defaultAddress?.id);

  const [openAddressModal, setOpenAddressModal] = useState(false);

  const [showNewAddress, setShowNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const currentAddress =
    addresses.find((item) => item.id === selectedAddress) || defaultAddress;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Change default address
  const selectAddress = (address) => {
    const updatedAddresses = addresses.map((item) => ({
      ...item,
      is_default: item.id === address.id ? 1 : 0,
    }));

    setAddresses(updatedAddresses);

    setSelectedAddress(address.id);

    setOpenAddressModal(false);
  };

  // Add new address and make default
  const saveNewAddress = () => {
    const newAddress = {
      id: Date.now(),
      ...formData,
      is_default: 1,
    };

    const updatedAddresses = addresses.map((item) => ({
      ...item,
      is_default: 0,
    }));

    updatedAddresses.push(newAddress);

    setAddresses(updatedAddresses);

    setSelectedAddress(newAddress.id);

    setShowNewAddress(false);

    setOpenAddressModal(false);

    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    });
  };

  const placeOrder = () => {
    if (!currentAddress) {
      alert("Please select address");
      return;
    }

    const order = {
      address: currentAddress,
      products: cart,
      total,
      date: new Date(),
    };

    localStorage.setItem("order", JSON.stringify(order));

    dispatch({
      type: CLEAR_CART,
    });

    navigate("/success");
  };

  return (
    <>
      <Navbar />

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

                {currentAddress && (
                  <Card.Root
                    borderWidth="1px"
                    borderColor="blue.400"
                    bg="blue.50"
                  >
                    <Card.Body>
                      <HStack justify="space-between">
                        <Box>
                          <Text fontWeight="bold">{currentAddress.name}</Text>

                          <Text>{currentAddress.address}</Text>

                          <Text>
                            {currentAddress.city}, {currentAddress.state} -{" "}
                            {currentAddress.zip}
                          </Text>

                          <Text>Phone: {currentAddress.phone}</Text>
                        </Box>

                        <Badge colorPalette="green">Default</Badge>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                )}

                <Button
                  variant="outline"
                  colorPalette="blue"
                  onClick={() => setOpenAddressModal(true)}
                >
                  Change Address
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* ORDER */}

          <Card.Root flex="1">
            <Card.Body>
              <Heading size="md" mb={4}>
                Order Summary
              </Heading>

              <VStack align="stretch">
                {cart.map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <HStack>
                      <Image src={item.image} boxSize="60px" />

                      <Text>
                        {item.title} x {item.quantity}
                      </Text>
                    </HStack>

                    <Text>${item.price * item.quantity}</Text>
                  </HStack>
                ))}

                <Heading size="md">Total: ${total.toFixed(2)}</Heading>

                <Button colorPalette="green" onClick={placeOrder}>
                  Place Order
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </HStack>
      </Box>

      {/* ADDRESS POPUP */}

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
                      borderWidth={address.is_default === 1 ? "2px" : "1px"}
                      borderColor={
                        address.is_default === 1 ? "blue.500" : "gray.200"
                      }
                      onClick={() => selectAddress(address)}
                    >
                      <Card.Body>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="bold">{address.name}</Text>

                            <Text>{address.address}</Text>

                            <Text>
                              {address.city}, {address.state} - {address.zip}
                            </Text>

                            <Text>Phone: {address.phone}</Text>
                          </Box>

                          {address.is_default === 1 && (
                            <Badge colorPalette="green">Default</Badge>
                          )}
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  ))}

                  {!showNewAddress && (
                    <Button
                      variant="outline"
                      onClick={() => setShowNewAddress(true)}
                    >
                      + Add New Address
                    </Button>
                  )}

                  {showNewAddress && (
                    <VStack gap={3}>
                      <Input
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                      <Input
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                      <Input
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                      />

                      <Input
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                      />

                      <Input
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                      />

                      <Input
                        name="zip"
                        placeholder="ZIP"
                        value={formData.zip}
                        onChange={handleChange}
                      />

                      <Button colorPalette="green" onClick={saveNewAddress}>
                        Save Address
                      </Button>
                    </VStack>
                  )}
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
