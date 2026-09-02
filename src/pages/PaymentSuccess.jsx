import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Separator,
    Text,
    VStack,
} from "@chakra-ui/react";

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            display="flex"
            alignItems="center"
            py={{ base: 6, md: 10 }}
        >
            <Container maxW="600px">
                <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="2xl"
                    boxShadow="lg"
                    overflow="hidden"
                    textAlign="center"
                >
                    {/* Success Header */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        pt={{ base: 8, md: 10 }}
                        pb={7}
                    >
                        {/* Success Icon */}
                        <Box
                            mx="auto"
                            mb={5}
                            w="80px"
                            h="80px"
                            borderRadius="full"
                            bg="green.100"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text
                                fontSize="4xl"
                                color="green.500"
                                fontWeight="bold"
                            >
                                ✓
                            </Text>
                        </Box>

                        <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="green.600"
                            letterSpacing="wide"
                            mb={2}
                        >
                            PAYMENT SUCCESSFUL
                        </Text>

                        <Heading
                            size={{ base: "lg", md: "xl" }}
                            color="gray.800"
                        >
                            Thank You for Your Payment!
                        </Heading>

                        <Text
                            mt={3}
                            color="gray.500"
                            fontSize="sm"
                            maxW="430px"
                            mx="auto"
                        >
                            Your payment has been successfully
                            processed and your order has been
                            confirmed.
                        </Text>
                    </Box>

                    <Separator />

                    {/* Order Details */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        py={6}
                        bg="gray.50"
                    >
                        <VStack gap={4}>

                            <Box
                                bg="white"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="xl"
                                p={5}
                                w="100%"
                            >
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    fontWeight="600"
                                    mb={1}
                                >
                                    ORDER NUMBER
                                </Text>

                                <Text
                                    fontSize="xl"
                                    fontWeight="800"
                                    color="gray.800"
                                >
                                    #{orderId}
                                </Text>
                            </Box>

                            <HStack
                                justify="space-between"
                                w="100%"
                                px={2}
                            >
                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                >
                                    Payment Status
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="green.600"
                                >
                                    Paid
                                </Text>
                            </HStack>

                            <HStack
                                justify="space-between"
                                w="100%"
                                px={2}
                            >
                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                >
                                    Order Status
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color="blue.600"
                                >
                                    Confirmed
                                </Text>
                            </HStack>

                        </VStack>
                    </Box>

                    <Separator />

                    {/* Actions */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        py={6}
                    >
                        <VStack gap={3}>

                            <Button
                                colorPalette="blue"
                                size="lg"
                                width="100%"
                                borderRadius="xl"
                                onClick={() =>
                                    navigate(
                                        `/orders`
                                    )
                                }
                            >
                                View Order
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                width="100%"
                                borderRadius="xl"
                                onClick={() =>
                                    navigate("/home")
                                }
                            >
                                Continue Shopping
                            </Button>

                        </VStack>
                    </Box>
                </Box>

                {/* Security / Confirmation */}
                <Text
                    textAlign="center"
                    mt={5}
                    fontSize="sm"
                    color="gray.500"
                >
                    📧 Your order confirmation will be
                    available in your account.
                </Text>
            </Container>
        </Box>
    );
};

export default PaymentSuccess;
