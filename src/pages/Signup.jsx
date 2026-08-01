import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem("registeredUser", JSON.stringify(user));

    alert("Account created successfully");

    navigate("/");
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
      <Card.Root width="100%" maxW="450px" shadow="lg">
        <Card.Body>
          <VStack gap={5}>
            <Heading size="lg">Create Account</Heading>

            <Field.Root>
              <Field.Label>Full Name</Field.Label>

              <Input
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Email</Field.Label>

              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
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
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </InputGroup>
            </Field.Root>

            <Field.Root>
              <Field.Label>Confirm Password</Field.Label>

              <InputGroup
                endElement={
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </InputGroup>
            </Field.Root>

            <Button width="100%" colorPalette="green" onClick={handleSignup}>
              Signup
            </Button>

            <Text fontSize="sm">
              Already have an account?{" "}
              <Link
                to="/"
                style={{
                  color: "#3182CE",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Signup;
