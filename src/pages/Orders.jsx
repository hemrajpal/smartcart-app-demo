import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  HStack,
  VStack,
  Icon,
  Separator,
} from "@chakra-ui/react";
import { FiPackage, FiCalendar, FiCreditCard } from "react-icons/fi";

import privateApi from "../config/privateApi";
import { useToast } from "../components/ToastProvider";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await privateApi.get("/order/list");

      setOrders(response.data.data || []);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to load orders.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      case "shipped":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Box maxW="1100px" mx="auto">
        <Heading mb={6}>My Orders</Heading>

        {loading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" />
          </Box>
        ) : orders.length === 0 ? (
          <Text color="gray.500">No orders found.</Text>
        ) : (
          <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
            {/* Header */}
            <HStack
              px={6}
              py={4}
              bg="gray.100"
              fontWeight="bold"
              justify="space-between"
            >
              <Text flex="1">Order</Text>

              <Text flex="1">Date</Text>

              <Text flex="1">Amount</Text>

              <Text flex="1">Status</Text>
            </HStack>

            {orders.map((order) => (
              <Box key={order.id}>
                <HStack
                  px={6}
                  py={5}
                  justify="space-between"
                  align="center"
                  _hover={{
                    bg: "gray.50",
                  }}
                >
                  {/* Order */}
                  <HStack flex="1">
                    <Icon as={FiPackage} color="blue.500" />

                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold">#{order.id}</Text>

                      <Text fontSize="sm" color="gray.500">
                        Order ID
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Date */}
                  <HStack flex="1">
                    <Icon as={FiCalendar} color="gray.500" />

                    <Text>
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </HStack>

                  {/* Amount */}
                  <HStack flex="1">
                    <Icon as={FiCreditCard} color="gray.500" />

                    <Text fontWeight="bold">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </Text>
                  </HStack>

                  {/* Status */}
                  <Box flex="1">
                    <Badge
                      colorPalette={getStatusColor(order.status)}
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {order.status}
                    </Badge>
                  </Box>
                </HStack>

                <Separator />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Orders;
