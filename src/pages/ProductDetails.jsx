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
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../redux/actionTypes";
import { useToast } from "../components/ToastProvider";
import { useEffect, useState } from "react";
import privateApi from "../config/privateApi";
import { Spinner } from "@chakra-ui/react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await privateApi.get(`/products/${id}`);

      setProduct(response.data.data);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to load product.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box py={20} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

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

  const addToCart = async () => {
    try {
      setCartLoading(true);

      await privateApi.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      dispatch({
        type: ADD_TO_CART,
        payload: product,
      });

      showToast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add product to cart.",
        type: "error",
      });
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <>
      <Box p={8}>
        <Card.Root>
          <Card.Body>
            <HStack align="start" gap={8}>
              <Image
                src={
                  product.image || "https://placehold.co/400x300?text=No+Image"
                }
                alt={product.name}
                maxW="350px"
                objectFit="cover"
                borderRadius="md"
              />

              <VStack align="start" gap={4} flex={1}>
                <Heading>{product.title}</Heading>

                <Text color="gray.500">{product.category}</Text>

                <Text fontSize="2xl" fontWeight="bold">
                  ₹{Number(product.price).toFixed(2)}
                </Text>

                {product.description && <Text>{product.description}</Text>}

                <HStack>
                  <Button
                    colorPalette="blue"
                    onClick={addToCart}
                    loading={cartLoading}
                    disabled={cartLoading}
                  >
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
