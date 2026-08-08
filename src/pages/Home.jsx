import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../redux/actionTypes";
import { useToast } from "../components/ToastProvider";
import privateApi from "../config/privateApi";

function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(null);

  const dispatch = useDispatch();
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await privateApi.get("/products");

      setProducts(response.data.data || []);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Unable to load products.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = async (product) => {
    try {
      setCartLoading(product.id);

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
      setCartLoading(null);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={5}>Shop Products</Heading>

      <Input
        placeholder="Search products..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <Spinner size="lg" color="blue.500" />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          {filteredProducts.map((product) => (
            <Card.Root key={product.id} shadow="md" overflow="hidden">
              <Link to={`/product/${product.id}`}>
                <Image
                  src={
                    product.image ||
                    "https://placehold.co/400x300?text=No+Image"
                  }
                  alt={product.name}
                  height="220px"
                  width="100%"
                  objectFit="cover"
                  fallbackSrc="https://placehold.co/400x300?text=No+Image"
                />
              </Link>

              <Card.Body>
                <VStack align="stretch" gap={3}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Heading
                      size="md"
                      _hover={{
                        color: "blue.500",
                      }}
                    >
                      {product.name}
                    </Heading>
                  </Link>

                  {/* Temporary category */}
                  <Text color="gray.600">General</Text>

                  {/* <Text color="gray.500" noOfLines={2}>
                    {product.description}
                  </Text> */}

                  <Text fontSize="xl" fontWeight="bold">
                    ₹{Number(product.price).toFixed(2)}
                  </Text>

                  <Button
                    colorPalette="blue"
                    onClick={() => addToCart(product)}
                    loading={cartLoading === product.id}
                    disabled={cartLoading === product.id}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    as={Link}
                    to={`/product/${product.id}`}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Home;
