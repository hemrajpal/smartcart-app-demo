import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Separator,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import privateApi from "../config/privateApi";

// Your API instance

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);


// --------------------------------------------------
// Stripe Payment Form
// --------------------------------------------------

const CheckoutForm = ({ orderId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,

                confirmParams: {
                    return_url: `${window.location.origin}/payment-success/${orderId}`,
                },

                redirect: "if_required",
            });

            if (error) {
                console.error("Stripe payment error:", error);

                setError(error.message);
                setLoading(false);
                return;
            }

            // Payment succeeded without redirect
            navigate(`/payment-success/${orderId}`);

        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                "Something went wrong while processing your payment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <VStack gap={5} align="stretch">

                {/* Stripe Payment Element */}
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    bg="white"
                >
                    <PaymentElement />
                </Box>

                {/* Error */}
                {error && (
                    <Box
                        bg="red.50"
                        border="1px solid"
                        borderColor="red.200"
                        borderRadius="lg"
                        p={3}
                    >
                        <Text
                            fontSize="sm"
                            color="red.600"
                        >
                            {error}
                        </Text>
                    </Box>
                )}

                {/* Pay Button */}
                <Button
                    type="submit"
                    colorPalette="blue"
                    size="lg"
                    width="100%"
                    borderRadius="xl"
                    loading={loading}
                    disabled={!stripe || !elements}
                >
                    {loading
                        ? "Processing Payment..."
                        : "Pay Now"}
                </Button>

                <HStack
                    justify="center"
                    color="gray.500"
                    fontSize="xs"
                >
                    <Text fontSize="md">🔒</Text>

                    <Text>
                        Payments are securely processed by Stripe.
                    </Text>
                </HStack>

            </VStack>

        </form>
    );
};


// --------------------------------------------------
// Payment Page
// --------------------------------------------------

const StripePayment = () => {
    const { orderId } = useParams();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await privateApi.post(
                    `/payment/create-stripe-payment-initiate/${orderId}`
                );

                setClientSecret(
                    response.data.data.client_secret
                );

            } catch (err) {
                console.error(err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to initialize payment."
                );
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            createPaymentIntent();
        }
    }, [orderId]);


    // Loading
    if (loading) {
        return (
            <Flex
                minH="100vh"
                align="center"
                justify="center"
            >
                <VStack gap={4}>
                    <Spinner
                        size="xl"
                        color="blue.500"
                    />

                    <Text color="gray.500">
                        Preparing secure payment...
                    </Text>
                </VStack>
            </Flex>
        );
    }


    // Error
    if (error) {
        return (
            <Flex
                minH="100vh"
                align="center"
                justify="center"
                px={5}
            >
                <Box
                    maxW="500px"
                    w="100%"
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="red.200"
                    p={6}
                    textAlign="center"
                >
                    <Text
                        fontSize="3xl"
                        mb={3}
                    >
                        ⚠️
                    </Text>

                    <Heading size="md">
                        Payment Unavailable
                    </Heading>

                    <Text
                        mt={2}
                        color="gray.500"
                    >
                        {error}
                    </Text>
                </Box>
            </Flex>
        );
    }


    if (!clientSecret) {
        return null;
    }


    const options = {
        clientSecret,
        appearance: {
            theme: "stripe",
            variables: {
                borderRadius: "10px",
            },
        },
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
                        >
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="blue.600"
                                    mb={2}
                                >
                                    SECURE CHECKOUT
                                </Text>

                                <Heading
                                    size={{
                                        base: "lg",
                                        md: "xl",
                                    }}
                                >
                                    Complete Your Payment
                                </Heading>

                                <Text
                                    mt={2}
                                    color="gray.500"
                                    fontSize="sm"
                                >
                                    Enter your payment details
                                    to complete your order.
                                </Text>
                            </Box>

                            {/* Order */}
                            <Box
                                bg="gray.100"
                                px={3}
                                py={2}
                                borderRadius="lg"
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
                                >
                                    #{orderId}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <Separator />

                    {/* Payment */}
                    <Box
                        px={{ base: 5, md: 8 }}
                        py={6}
                    >
                        <Elements
                            stripe={stripePromise}
                            options={options}
                        >
                            <CheckoutForm
                                orderId={orderId}
                            />
                        </Elements>
                    </Box>

                </Box>

                {/* Security text */}
                <Text
                    textAlign="center"
                    mt={5}
                    fontSize="sm"
                    color="gray.500"
                >
                    🔒 Your payment information is
                    encrypted and secure.
                </Text>

            </Container>
        </Box>
    );
};

export default StripePayment;