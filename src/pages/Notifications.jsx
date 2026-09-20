import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Spinner,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import privateApi from "../config/privateApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      const response = await privateApi.get("/notifications");

      const result = await response.data;

      if (result.status) {
        setNotifications(result.data.notifications.data);
        setUnreadCount(result.data.unread_count);
      }
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      const response = await fetch(
        `http://127.0.0.1:8000/api/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.status) {
        // Update UI immediately
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  read_at: new Date().toISOString(),
                }
              : notification
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      const response = await fetch(
        "http://127.0.0.1:8000/api/notifications/read-all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.status) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            read_at: notification.read_at
              ? notification.read_at
              : new Date().toISOString(),
          }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <HStack>
          <Heading size="lg">🔔 Notifications</Heading>

          {unreadCount > 0 && (
            <Badge colorPalette="red">
              {unreadCount} unread
            </Badge>
          )}
        </HStack>

        {unreadCount > 0 && (
          <Button
            size="sm"
            colorPalette="blue"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </Flex>

      {/* Notifications */}
      {notifications.length === 0 ? (
        <Box
          p={8}
          textAlign="center"
          borderWidth="1px"
          borderRadius="md"
        >
          <Text color="gray.500">
            No notifications found.
          </Text>
        </Box>
      ) : (
        <Stack gap={3}>
          {notifications.map((notification) => {
            const isUnread = notification.read_at === null;

            return (
              <Box
                key={notification.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={isUnread ? "blue.50" : "white"}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  gap={4}
                >
                  <Box>
                    <Text
                      fontWeight={isUnread ? "bold" : "normal"}
                    >
                      {notification.data.message}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                      mt={1}
                    >
                      Order #{notification.data.order_id}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                    >
                      Amount: ₹{notification.data.amount}
                    </Text>

                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mt={2}
                    >
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </Text>
                  </Box>

                  {isUnread && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      Mark as read
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

export default Notifications;