import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

import { RadioGroup } from "@chakra-ui/react";

const PaymentMethod = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        try {
            setLoading(true);

            if (paymentMethod === "cod") {
                // Call Laravel API
                //
                // await privateApi.post(
                //     `/orders/${orderId}/payment-method`,
                //     {
                //         payment_method: "cod",
                //     }
                // );

                navigate(`/order-success/${orderId}`);
            } else {
                navigate(`/payment/${orderId}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={10}>
            <VStack gap={6} align="stretch">

                <Box>
                    <Heading size="lg">
                        Select Payment Method
                    </Heading>

                    <Text mt={2} color="gray.600">
                        Choose how you want to pay for your order.
                    </Text>
                </Box>

                <RadioGroup.Root
                    value={[paymentMethod]}
                    onValueChange={(details) => {
                        setPaymentMethod(details.value[0]);
                    }}
                >
                    <Stack gap={4}>

                        {/* Cash on Delivery */}
                        <Box
                            border="1px solid"
                            borderColor={
                                paymentMethod === "cod"
                                    ? "blue.500"
                                    : "gray.200"
                            }
                            borderRadius="lg"
                            p={5}
                            cursor="pointer"
                            bg={
                                paymentMethod === "cod"
                                    ? "blue.50"
                                    : "white"
                            }
                            onClick={() =>
                                setPaymentMethod("cod")
                            }
                        >
                            <RadioGroup.Item value="cod">
                                <RadioGroup.ItemHiddenInput />

                                <RadioGroup.ItemIndicator />

                                <RadioGroup.ItemText>
                                    <Box>
                                        <Text fontWeight="bold">
                                            Cash on Delivery
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            mt={1}
                                        >
                                            Pay when your order is
                                            delivered.
                                        </Text>
                                    </Box>
                                </RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </Box>

                        {/* Pay Now */}
                        <Box
                            border="1px solid"
                            borderColor={
                                paymentMethod === "online"
                                    ? "blue.500"
                                    : "gray.200"
                            }
                            borderRadius="lg"
                            p={5}
                            cursor="pointer"
                            bg={
                                paymentMethod === "online"
                                    ? "blue.50"
                                    : "white"
                            }
                            onClick={() =>
                                setPaymentMethod("online")
                            }
                        >
                            <RadioGroup.Item value="online">
                                <RadioGroup.ItemHiddenInput />

                                <RadioGroup.ItemIndicator />

                                <RadioGroup.ItemText>
                                    <Box>
                                        <Text fontWeight="bold">
                                            Pay Now
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            mt={1}
                                        >
                                            Pay securely using
                                            your card.
                                        </Text>
                                    </Box>
                                </RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </Box>

                    </Stack>
                </RadioGroup.Root>

                <Button
                    colorPalette="blue"
                    size="lg"
                    width="100%"
                    onClick={handleContinue}
                    loading={loading}
                >
                    Continue
                </Button>

            </VStack>
        </Container>
    );
};

export default PaymentMethod;