import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  Avatar,
  Button,
} from "@chakra-ui/react";

function Account() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth?.user;

  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Card.Root maxW="500px" mx="auto">
        <Card.Body>
          <VStack gap={5}>
            <Avatar.Root size="xl">
              <Avatar.Fallback name={user?.name} />
            </Avatar.Root>

            <Heading size="lg">My Account</Heading>

            <Text>Name: {user?.name}</Text>

            <Text>Email: {user?.email}</Text>

            <Text>Role: {user?.role}</Text>

            <Button colorPalette="blue">Upload Profile Photo</Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Account;
