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
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import products from "../data/products";
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../redux/actionTypes";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <>
        <Navbar />
        <Box p={8}>
          <Heading size="lg">Product not found</Heading>

          <Button mt={5} colorPalette="blue" onClick={() => navigate("/home")}>
            Back to Home
          </Button>
        </Box>
      </>
    );
  }

  const addToCart = () => {
    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });

    alert("Product added to cart");
  };

  return (
    <>
      <Navbar />

      <Box p={8}>
        <Card.Root>
          <Card.Body>
            <HStack align="start" gap={8}>
              <Image
                src={product.image}
                alt={product.title}
                maxW="350px"
                objectFit="cover"
                borderRadius="md"
              />

              <VStack align="start" gap={4} flex={1}>
                <Heading>{product.title}</Heading>

                <Text color="gray.500">{product.category}</Text>

                <Text fontSize="2xl" fontWeight="bold">
                  ${product.price}
                </Text>

                {product.description && <Text>{product.description}</Text>}

                <HStack>
                  <Button colorPalette="blue" onClick={addToCart}>
                    Add to Cart
                  </Button>

                  <Button variant="outline" onClick={() => navigate("/cart")}>
                    Go to Cart
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  );
}

export default ProductDetails;
