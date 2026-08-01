import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  InputGroup,
  Card,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      alert("Please signup first");
      return;
    }

    if (
      savedUser.email === formData.email &&
      savedUser.password === formData.password
    ) {
      localStorage.setItem("user", JSON.stringify(savedUser));

      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      px={4}
    >
      <Card.Root width="100%" maxW="420px" shadow="lg">
        <Card.Body>
          <VStack gap={5}>
            <Heading size="lg">Login</Heading>

            <Field.Root>
              <Field.Label>Email</Field.Label>

              <Input
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>

              <InputGroup
                endElement={
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </InputGroup>
            </Field.Root>

            <Button width="100%" colorPalette="blue" onClick={handleLogin}>
              Login
            </Button>

            <Text fontSize="sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#3182CE",
                  fontWeight: "bold",
                }}
              >
                Signup
              </Link>
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Login;
