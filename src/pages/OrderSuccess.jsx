import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={5}>
        <Heading color="green.500">Order Placed Successfully 🎉</Heading>

        <Text>Thank you for shopping with us.</Text>

        <Button colorPalette="blue" onClick={() => navigate("/home")}>
          Continue Shopping
        </Button>
      </VStack>
    </Box>
  );
}

export default OrderSuccess;
