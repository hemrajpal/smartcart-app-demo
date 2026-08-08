import { Box, Button, Card, Heading, Input, VStack } from "@chakra-ui/react";

import { useState } from "react";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updatePassword = () => {
    console.log(form);

    // API call:
    // PUT /api/change-password
  };

  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Card.Root maxW="450px" mx="auto">
        <Card.Body>
          <VStack gap={4}>
            <Heading size="lg">Change Password</Heading>

            <Input
              type="password"
              placeholder="Current password"
              onChange={(e) =>
                setForm({
                  ...form,
                  oldPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              placeholder="New password"
              onChange={(e) =>
                setForm({
                  ...form,
                  newPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              placeholder="Confirm password"
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Button width="100%" colorPalette="blue" onClick={updatePassword}>
              Update Password
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default ChangePassword;
