import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Separator,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

import { RadioGroup } from "@chakra-ui/react";
import privateApi from "../config/privateApi";

const PaymentMethod = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        try {
            setLoading(true);

            if (paymentMethod === "cod") {
                await privateApi.post(
                    `/payment/create-cod-payment-order/${orderId}`,
                    {
                        payment_method: "cod",
                    }
                )

                navigate(`/success`);
            } else {
                navigate(`/stripe-payment/${orderId}`);
                
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            py={{ base: 6, md: 12 }}
        >
            <Container maxW="680px">

                {/* Main Card */}
                <Box
                    bg="white"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    overflow="hidden"
                >

                    {/* Header */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        pt={{ base: 6, md: 8 }}
                        pb={5}
                    >
                        <Flex
                            justify="space-between"
                            align="flex-start"
                            gap={4}
                        >
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="blue.600"
                                    mb={2}
                                >
                                    CHECKOUT
                                </Text>

                                <Heading
                                    size={{ base: "lg", md: "xl" }}
                                    color="gray.800"
                                >
                                    Select Payment Method
                                </Heading>

                                <Text
                                    mt={2}
                                    color="gray.500"
                                    fontSize="sm"
                                >
                                    Choose your preferred payment
                                    option to complete your order.
                                </Text>
                            </Box>

                            {/* Order ID */}
                            <Box
                                bg="gray.100"
                                px={3}
                                py={2}
                                borderRadius="lg"
                                flexShrink={0}
                            >
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    ORDER
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="gray.700"
                                >
                                    #{orderId}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <Separator />

                    {/* Payment Options */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        py={6}
                    >
                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.700"
                            mb={4}
                        >
                            PAYMENT OPTIONS
                        </Text>

                        <RadioGroup.Root
                            value={paymentMethod}
                            onValueChange={(details) => {
                                setPaymentMethod(details.value);
                            }}
                        >
                            <Stack gap={4}>

                                {/* Cash on Delivery */}
                                <Box
                                    border="2px solid"
                                    borderColor={
                                        paymentMethod === "cod"
                                            ? "blue.500"
                                            : "gray.200"
                                    }
                                    borderRadius="xl"
                                    p={5}
                                    cursor="pointer"
                                    bg={
                                        paymentMethod === "cod"
                                            ? "blue.50"
                                            : "white"
                                    }
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: "blue.400",
                                    }}
                                    onClick={() => setPaymentMethod("cod")}
                                >
                                    <RadioGroup.Item value="cod">
                                        <RadioGroup.ItemHiddenInput />

                                        <Flex align="center" gap={4}>
                                            <RadioGroup.ItemIndicator />

                                            <Flex
                                                align="center"
                                                justify="center"
                                                w="48px"
                                                h="48px"
                                                borderRadius="xl"
                                                bg="orange.100"
                                                fontSize="xl"
                                            >
                                                💵
                                            </Flex>

                                            <Box>
                                                <Text fontWeight="700">
                                                    Cash on Delivery
                                                </Text>

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                    mt={1}
                                                >
                                                    Pay when your order arrives.
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </RadioGroup.Item>
                                </Box>


                                {/* Pay Now */}
                                <Box
                                    border="2px solid"
                                    borderColor={
                                        paymentMethod === "online"
                                            ? "blue.500"
                                            : "gray.200"
                                    }
                                    borderRadius="xl"
                                    p={5}
                                    cursor="pointer"
                                    bg={
                                        paymentMethod === "online"
                                            ? "blue.50"
                                            : "white"
                                    }
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: "blue.400",
                                    }}
                                    onClick={() => setPaymentMethod("online")}
                                >
                                    <RadioGroup.Item value="online">
                                        <RadioGroup.ItemHiddenInput />

                                        <Flex align="center" gap={4}>
                                            <RadioGroup.ItemIndicator />

                                            <Flex
                                                align="center"
                                                justify="center"
                                                w="48px"
                                                h="48px"
                                                borderRadius="xl"
                                                bg="green.100"
                                                fontSize="xl"
                                            >
                                                💳
                                            </Flex>

                                            <Box>
                                                <Flex align="center" gap={2}>
                                                    <Text fontWeight="700">
                                                        Pay Now
                                                    </Text>

                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="600"
                                                        color="green.600"
                                                        bg="green.100"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        SECURE
                                                    </Text>
                                                </Flex>

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                    mt={1}
                                                >
                                                    Pay securely using your card.
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </RadioGroup.Item>
                                </Box>

                            </Stack>
                        </RadioGroup.Root>
                    </Box>

                    <Separator />

                    {/* Footer */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        py={6}
                        bg="gray.50"
                    >
                        <VStack gap={4} align="stretch">

                            {/* Security */}
                            <HStack
                                justify="center"
                                color="gray.500"
                                fontSize="xs"
                            >
                                <Text fontSize="md">🔒</Text>

                                <Text>
                                    Your payment information is
                                    secure and protected.
                                </Text>
                            </HStack>

                            {/* Continue */}
                            <Button
                                colorPalette="blue"
                                size="lg"
                                width="100%"
                                borderRadius="xl"
                                onClick={handleContinue}
                                loading={loading}
                                loadingText="Processing..."
                            >
                                Continue
                            </Button>

                            <Text
                                textAlign="center"
                                fontSize="xs"
                                color="gray.400"
                            >
                                By continuing, you agree to our
                                payment and order terms.
                            </Text>

                        </VStack>
                    </Box>

                </Box>

                {/* Bottom Help */}
                <Text
                    textAlign="center"
                    mt={5}
                    fontSize="sm"
                    color="gray.500"
                >
                    Need help with your order?{" "}
                    <Text
                        as="span"
                        color="blue.500"
                        fontWeight="600"
                        cursor="pointer"
                    >
                        Contact Support
                    </Text>
                </Text>

            </Container>
        </Box>
    );
};

export default PaymentMethod;
