import React, { useState, useRef, useEffect } from "react";
import { useLoaderData, redirect, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteEvent } from "../components/DeleteEvent";
import { EditEvent } from "../components/EditEvent";

// Loader function to fetch event data
export const loader = async ({ params }) => {
  const fetchUsers = await fetch("http://localhost:3000/users");
  const fetchEvent = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const fetchCategories = await fetch("http://localhost:3000/categories");

  const usersData = await fetchUsers.json();
  const eventData = await fetchEvent.json();
  const categoriesData = await fetchCategories.json();

  return {
    users: usersData,
    event: eventData,
    categories: categoriesData,
  };
};

export const EventPage = () => {
  const { users, event, categories } = useLoaderData();
  const [editEventForm, setEditEventForm] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleUpdate = () => {
    setEditEventForm(false);
    navigate(`/event/${event.id}`);
  };

  const handleDelete = () => {
    navigate("/");
  };

  // Function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "";
  };

  // Function to get user name by ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "";
  };

  // Function to get user image by ID
  const getUserImageById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.image : "";
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
        width="100vw"
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          maxWidth="100%"
          width="100%"
          overflow="hidden"
          textAlign="left"
        >
          <Image
            src={event.image ? event.image : "../src/utils/newevent.jpeg"}
            alt={event.title}
            boxSize="30rem"
            margin={{ base: "2rem auto", md: "5rem" }}
          />
          <Box>
            <Heading mb={4}>{event.title}</Heading>
            <Box display="flex" mb={4}>
              <Text fontWeight="bold">Hosted By: </Text>
              <Text ml={2}>
                {event.createdBy
                  ? getUserNameById(event.createdBy)
                  : "New User"}
              </Text>
            </Box>
            <Image
              src={
                event.createdBy
                  ? getUserImageById(event.createdBy)
                  : "../src//utils/newuser.jpg"
              }
              alt={
                event.createdBy ? getUserNameById(event.createdBy) : "New User"
              }
              boxSize="10rem"
              mb={4}
            />

            <Box display="flex" mb={4}>
              <Text fontWeight="bold">Description: </Text>
              <Text ml={2}>{event.description}</Text>
            </Box>
            <Box display="flex" mb={4}>
              <Text fontWeight="bold">Location: </Text>
              <Text ml={2}>{event.location}</Text>
            </Box>
            <Box display="flex" mb={4}>
              <Text fontWeight="bold">Start Time: </Text>
              <Text ml={2}>{new Date(event.startTime).toLocaleString()}</Text>
            </Box>
            <Box display="flex" mb={4}>
              <Text fontWeight="bold">End Time: </Text>
              <Text ml={2}>{new Date(event.endTime).toLocaleString()}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Categories: </Text>
              {event.categoryIds.map((category, index) => (
                <Badge key={index} mr={2} colorScheme="green">
                  {getCategoryNameById(category)}
                </Badge>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="green"
          onClick={() => setEditEventForm(true)}
          size="lg"
          width="150px"
          mr={4}
        >
          Edit
        </Button>
        <Button colorScheme="red" onClick={onOpen} size="lg" width="150px">
          Delete
        </Button>
      </Box>

      <EditEvent
        isOpen={editEventForm}
        onClose={() => setEditEventForm(false)}
        event={event}
        users={users}
        categories={categories}
        onUpdate={handleUpdate}
      />

      <DeleteEvent
        isOpen={isOpen}
        onClose={onClose}
        eventId={event.id}
        onDelete={handleDelete}
      />
    </>
  );
};
