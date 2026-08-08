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

import { signup } from "../services/auth.service";
import { useToast } from "../components/ToastProvider";

function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await signup(payload);

      console.log(response.data);

      showToast({
        title: "Account created",
        description: "Your account has been created successfully.",
        type: "success",
      });

      navigate("/");
    } catch (error) {
      showToast({
        title: "Signup failed",
        description:
          error.response?.data?.message || "Unable to create account",
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
      <Card.Root width="100%" maxW="450px" shadow="lg">
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={5}>
              <Heading size="lg">Create Account</Heading>

              <Field.Root invalid={!!errors.name}>
                <Field.Label>Full Name</Field.Label>

                <Input
                  placeholder="Enter your name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>

                <Input
                  type="email"
                  placeholder="Enter your email"
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
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </InputGroup>

                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirm Password</Field.Label>

                <InputGroup
                  endElement={
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  }
                >
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                </InputGroup>

                <Field.ErrorText>
                  {errors.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>

              <Button
                type="submit"
                width="100%"
                colorPalette="green"
                loading={isSubmitting}
              >
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
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Signup;
