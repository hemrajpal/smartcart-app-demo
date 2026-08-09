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
import { useForm } from "react-hook-form";

import { login } from "../services/auth.service";
import { useToast } from "../components/ToastProvider";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      const authData = {
        isLoggedIn: true,
        token: response.data.data.token,
        user: response.data.data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      showToast({
        title: "Login successful",
        description: `Welcome ${response.data.data.user.name}`,
        type: "success",
      });

      navigate("/home");
    } catch (error) {
      showToast({
        title: "Login failed",
        description:
          error.response?.data?.message || "Invalid email or password",
        type: "error",
      });
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={5}>
              <Heading size="lg">Login</Heading>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>

                <Input
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  })}
                />

                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>

                <InputGroup
                  endElement={
                    <Button
                      size="xs"
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                </InputGroup>

                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>

              <Button
                type="submit"
                width="100%"
                colorPalette="blue"
                loading={isSubmitting}
              >
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
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Login;
