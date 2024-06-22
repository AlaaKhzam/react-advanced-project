import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";

export const EditEvent = ({
  isOpen,
  onClose,
  event,
  users,
  categories,
  onUpdate,
}) => {
  const toLocalDateTimeString = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event.title || "",
    createdBy: event.createdBy || "",
    description: event.description || "",
    image: event.image || "",
    location: event.location || "",
    startTime: toLocalDateTimeString(
      event.startTime || new Date().toISOString()
    ),
    endTime: toLocalDateTimeString(event.endTime || new Date().toISOString()),
  });

  const [selectedCategories, setSelectedCategories] = useState(
    event.categoryIds || []
  );
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const updatedEvent = {
      ...formData,
      categoryIds: selectedCategories,
    };
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedEvent),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        toast({
          title: "Event updated successfully.",
          description: "We've updated your event details.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        onUpdate();
      } else {
        toast({
          title: "Failed to update the event.",
          description: "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to update event. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Event Title</FormLabel>
            <Input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Event Description</FormLabel>
            <Textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup
              colorScheme="green"
              value={selectedCategories.map(String)}
              onChange={(values) => setSelectedCategories(values.map(Number))}
            >
              <Stack pl={6} mt={1} spacing={1}>
                {categories.map((category) => (
                  <Checkbox key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Start Time</FormLabel>
            <Input
              name="startTime"
              type="datetime-local"
              placeholder="Start Time"
              value={formData.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>End Time</FormLabel>
            <Input
              name="endTime"
              type="datetime-local"
              placeholder="End Time"
              value={formData.endTime}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
