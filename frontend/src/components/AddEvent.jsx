import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Checkbox,
  Button,
} from "@chakra-ui/react";

export const AddEvent = ({
  isOpen,
  onClose,
  events,
  setEventsList,
  eventCategories,
}) => {
  const [eventDetails, setEventDetails] = useState({
    eventTitle: "",
    eventDescription: "",
    eventImage: "",
    selectedCategoriesForm: [],
    eventLocation: "",
    eventStartTime: "",
    eventEndTime: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!eventDetails.eventTitle)
      newErrors.eventTitle = "Event title is required";
    if (!eventDetails.eventLocation)
      newErrors.eventLocation = "Event location is required";
    if (!eventDetails.eventStartTime)
      newErrors.eventStartTime = "Start time is required";
    if (!eventDetails.eventEndTime)
      newErrors.eventEndTime = "End time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChangeForm = (categoryId) => {
    setEventDetails((prevDetails) => {
      const selectedCategoriesForm =
        prevDetails.selectedCategoriesForm.includes(categoryId)
          ? prevDetails.selectedCategoriesForm.filter((id) => id !== categoryId)
          : [...prevDetails.selectedCategoriesForm, categoryId];
      return { ...prevDetails, selectedCategoriesForm };
    });
  };

  const handleAddEvent = async () => {
    const {
      eventTitle,
      eventDescription,
      eventImage,
      selectedCategoriesForm,
      eventLocation,
      eventStartTime,
      eventEndTime,
    } = eventDetails;

    const eventData = {
      id: events.length + 1,
      createdBy: 0,
      title: eventTitle,
      description: eventDescription,
      image: eventImage,
      categoryIds: selectedCategoriesForm.map((category) => Number(category)),
      location: eventLocation,
      startTime: eventStartTime,
      endTime: eventEndTime,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      const result = await response.json();
      setEventsList((prevEvents) => [...prevEvents, result]);
      onClose();
      setEventDetails({
        eventTitle: "",
        eventDescription: "",
        eventImage: "",
        selectedCategoriesForm: [],
        eventLocation: "",
        eventStartTime: "",
        eventEndTime: "",
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      handleAddEvent();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="2xl">
        <ModalHeader>Add a New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4} isInvalid={errors.eventTitle}>
            <FormLabel>Event Title</FormLabel>
            <Input
              type="text"
              name="eventTitle"
              value={eventDetails.eventTitle}
              onChange={handleChange}
              placeholder="Event Title"
            />
            {errors.eventTitle && (
              <p style={{ color: "red" }}>{errors.eventTitle}</p>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Event Description</FormLabel>
            <Textarea
              name="eventDescription"
              value={eventDetails.eventDescription}
              onChange={handleChange}
              placeholder="Event Description"
              rows={5}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="text"
              name="eventImage"
              value={eventDetails.eventImage}
              onChange={handleChange}
              placeholder="Image URL"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>
              To which categories can you classify this event
            </FormLabel>
            <Stack spacing={2}>
              {eventCategories.map((category) => (
                <Checkbox
                  key={category.id}
                  value={category.id}
                  isChecked={eventDetails.selectedCategoriesForm.includes(
                    category.id
                  )}
                  onChange={() => handleCheckboxChangeForm(category.id)}
                >
                  {category.name}
                </Checkbox>
              ))}
            </Stack>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.eventLocation}>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="eventLocation"
              value={eventDetails.eventLocation}
              onChange={handleChange}
              placeholder="Location"
            />
            {errors.eventLocation && (
              <p style={{ color: "red" }}>{errors.eventLocation}</p>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={errors.eventStartTime}>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="eventStartTime"
              value={eventDetails.eventStartTime}
              onChange={handleChange}
              placeholder="Start Time"
            />
            {errors.eventStartTime && (
              <p style={{ color: "red" }}>{errors.eventStartTime}</p>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={errors.eventEndTime}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="eventEndTime"
              value={eventDetails.eventEndTime}
              onChange={handleChange}
              placeholder="End Time"
            />
            {errors.eventEndTime && (
              <p style={{ color: "red" }}>{errors.eventEndTime}</p>
            )}
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
