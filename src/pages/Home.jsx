import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import products from "../data/products";
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../redux/actionTypes";

function Home() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });

    //alert("Added to cart");
  };

  return (
    <>
      <Navbar />

      <Box p={6}>
        <Heading mb={5}>Shop Products</Heading>

        <Input
          placeholder="Search products..."
          mb={6}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
                  src={product.image}
                  alt={product.title}
                  height="220px"
                  objectFit="cover"
                  cursor="pointer"
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
                      {product.title}
                    </Heading>
                  </Link>

                  <Text color="gray.600">{product.category}</Text>

                  <Text fontSize="xl" fontWeight="bold">
                    ${product.price}
                  </Text>

                  <Button
                    colorPalette="blue"
                    onClick={() => addToCart(product)}
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
      </Box>
    </>
  );
}

export default Home;
