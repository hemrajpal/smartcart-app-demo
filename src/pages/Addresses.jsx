import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Field,
  Heading,
  Input,
  Portal,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  Checkbox,
  HStack,
  Badge,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";

import privateApi from "../config/privateApi";
import { useToast } from "../components/ToastProvider";

function Addresses() {
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);

  const [open, setOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [pageLoading, setPageLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: "0",
    },
  });

  const fetchAddresses = async () => {
    try {
      setPageLoading(true);

      const response = await privateApi.get("/address/list");

      setAddresses(response.data.data);
    } catch (error) {
      showToast({
        title: "Error",

        description: "Unable to fetch addresses",

        type: "error",
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (item) => {
    setEditMode(true);

    setSelectedId(item.id);

    reset({
      name: item.name,
      phone: item.phone,
      address_line_1: item.address_line_1,
      address_line_2: item.address_line_2,
      city: item.city,
      state: item.state,
      country: item.country,
      postal_code: item.postal_code,
      is_default: item.is_default || "0",
    });

    setOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(deleteId);

      await privateApi.delete(`/address/delete/${deleteId}`);

      showToast({
        title: "Deleted",
        description: "Address deleted successfully",
        type: "success",
      });

      setDeleteOpen(false);
      setDeleteId(null);

      fetchAddresses();
    } catch (error) {
      showToast({
        title: "Failed",
        description:
          error.response?.data?.message || "Unable to delete address",
        type: "error",
      });
    } finally {
      setDeleting(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      if (editMode) {
        await privateApi.post(
          `/address/edit/${selectedId}`,

          data
        );

        showToast({
          title: "Updated",

          description: "Address updated successfully",

          type: "success",
        });
      } else {
        await privateApi.post(
          "/address/add",

          data
        );

        showToast({
          title: "Added",

          description: "Address added successfully",

          type: "success",
        });
      }

      reset();

      setOpen(false);

      setEditMode(false);

      setSelectedId(null);

      fetchAddresses();
    } catch (error) {
      showToast({
        title: "Failed",

        description: error.response?.data?.message || "Unable to save address",

        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const openAddDialog = () => {
    setEditMode(false);

    setSelectedId(null);

    reset({
      name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: "0",
    });

    setOpen(true);
  };

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Box maxW="1100px" mx="auto">
        <HStack justify="space-between" mb={8}>
          <Box>
            <Heading size="lg">My Addresses</Heading>

            <Text color="gray.500">Manage your delivery addresses</Text>
          </Box>

          <Button colorPalette="blue" onClick={openAddDialog}>
            + Add Address
          </Button>
        </HStack>

        {pageLoading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" />
          </Box>
        ) : addresses.length === 0 ? (
          <Box
            bg="white"
            p={10}
            textAlign="center"
            borderRadius="lg"
            shadow="sm"
          >
            <Text color="gray.500">No address found</Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap={6}
          >
            {addresses.map((item) => (
              <Box
                key={item.id}
                bg="white"
                borderRadius="xl"
                p={6}
                shadow="sm"
                border="1px solid"
                borderColor="gray.100"
                transition="0.2s"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-3px)",
                }}
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="md">{item.name}</Heading>

                  {item.is_default === true && (
                    <Badge colorPalette="green" borderRadius="full" px={3}>
                      Default
                    </Badge>
                  )}
                </HStack>

                <VStack align="stretch" gap={2} color="gray.600">
                  <Text>📞 {item.phone}</Text>

                  <Text>📍 {item.address_line_1}</Text>

                  {item.address_line_2 && <Text>{item.address_line_2}</Text>}

                  <Text>
                    {item.city}, {item.state}
                  </Text>

                  <Text>
                    {item.country} - {item.postal_code}
                  </Text>
                </VStack>

                <HStack mt={6}>
                  <Button
                    size="sm"
                    flex="1"
                    colorPalette="blue"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    flex="1"
                    colorPalette="red"
                    loading={deleting === item.id}
                    loadingText="Deleting"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Header>
                  <Dialog.Title>
                    {editMode ? "Edit Address" : "Add Address"}
                  </Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                  <VStack gap={4}>
                    <Field.Root invalid={!!errors.name}>
                      <Field.Label>Name</Field.Label>

                      <Input
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />

                      <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.phone}>
                      <Field.Label>Phone</Field.Label>

                      <Input
                        {...register("phone", {
                          required: "Phone is required",

                          pattern: {
                            value: /^[0-9]{10}$/,

                            message: "Enter valid phone number",
                          },
                        })}
                      />

                      <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.address_line_1}>
                      <Field.Label>Address Line 1</Field.Label>

                      <Input
                        {...register("address_line_1", {
                          required: "Address line 1 is required",
                        })}
                      />

                      <Field.ErrorText>
                        {errors.address_line_1?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.address_line_2}>
                      <Field.Label>Address Line 2</Field.Label>

                      <Input
                        {...register("address_line_2", {
                          required: "Address line 2 is required",
                        })}
                      />

                      <Field.ErrorText>
                        {errors.address_line_2?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <SimpleGrid columns={2} gap={3} width="100%">
                      <Field.Root invalid={!!errors.city}>
                        <Field.Label>City</Field.Label>

                        <Input
                          {...register("city", {
                            required: "City is required",
                          })}
                        />

                        <Field.ErrorText>
                          {errors.city?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.state}>
                        <Field.Label>State</Field.Label>

                        <Input
                          {...register("state", {
                            required: "State is required",
                          })}
                        />

                        <Field.ErrorText>
                          {errors.state?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </SimpleGrid>

                    <SimpleGrid columns={2} gap={3} width="100%">
                      <Field.Root invalid={!!errors.country}>
                        <Field.Label>Country</Field.Label>

                        <Input
                          {...register("country", {
                            required: "Country is required",
                          })}
                        />

                        <Field.ErrorText>
                          {errors.country?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.postal_code}>
                        <Field.Label>Postal Code</Field.Label>

                        <Input
                          {...register("postal_code", {
                            required: "Postal code is required",

                            pattern: {
                              value: /^[0-9]{6}$/,

                              message: "Enter valid postal code",
                            },
                          })}
                        />

                        <Field.ErrorText>
                          {errors.postal_code?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </SimpleGrid>
                    <Controller
                      name="is_default"
                      control={control}
                      render={({ field }) => (
                        <Checkbox.Root
                          //checked={field.value === true}
                          onCheckedChange={(e) =>
                            field.onChange(e.checked ? "1" : "0")
                          }
                        >
                          <Checkbox.HiddenInput />

                          <Checkbox.Control />

                          <Checkbox.Label>
                            Set as default address
                          </Checkbox.Label>
                        </Checkbox.Root>
                      )}
                    />
                  </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={saving}
                    loadingText={editMode ? "Updating..." : "Saving..."}
                  >
                    {editMode ? "Update Address" : "Save Address"}
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={deleteOpen}
        onOpenChange={(e) => setDeleteOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Address</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Text>
                  Are you sure you want to delete this address? This action
                  cannot be undone.
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>

                <Button
                  colorPalette="red"
                  loading={deleting !== null}
                  loadingText="Deleting..."
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

export default Addresses;
