import React, { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { Heading, Box, Text, Button, Input, Checkbox } from "@chakra-ui/react";
import { AddEvent } from "../components/AddEvent";
import { EventsList } from "../components/EventsList";

// loader function to fetch data from the server
export const loader = async () => {
  const fetchUsers = await fetch("http://localhost:3000/users");
  const fetchEvents = await fetch("http://localhost:3000/events");
  const fetchCategories = await fetch("http://localhost:3000/categories");

  const usersData = await fetchUsers.json();
  const eventsData = await fetchEvents.json();
  const categoriesData = await fetchCategories.json();

  return {
    users: usersData,
    events: eventsData,
    eventCategories: categoriesData,
  };
};

// EventsPage component
export const EventsPage = () => {
  // Initial data from loader
  const { users, events, eventCategories } = useLoaderData();

  // State Constants
  const [eventsList, setEventsList] = useState(events);
  const [addEvent, setAddEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoriesFilter, setSelectedCategoriesFilter] = useState([]);

  // Filter events based on search term and selected categories
  const filteredEvents = eventsList.filter((event) => {
    const titleMatch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatch = event.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategoriesFilter.length === 0 ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.some((categoryId) =>
          selectedCategoriesFilter.includes(categoryId)
        ));
    return (titleMatch || descriptionMatch) && categoryMatch;
  });

  // Function to handle checkbox change of categories selection for Filter
  const handleCheckboxChangeFilter = (categoryId) => {
    setSelectedCategoriesFilter((prevSelectedCategories) => {
      return prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId];
    });
  };

  return (
    <>
      <Box marginBottom="2rem" marginTop="2rem" style={{ textAlign: "center" }}>
        <Heading style={{ fontSize: "2rem", color: "black" }}>
          List of events
        </Heading>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="2rem"
        marginTop="2rem"
      >
        <Input
          type="text"
          placeholder="Search for events ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "30%",
            margin: "0 auto",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </Box>
      <Box
        style={{
          padding: "0 2rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginBottom: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Filter for categories:
        </Text>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {eventCategories.map((category) => (
            <Box
              key={category.id}
              style={{ marginRight: "10px", marginBottom: "5px" }}
            >
              <Checkbox
                checked={selectedCategoriesFilter.includes(category.id)}
                onChange={() => handleCheckboxChangeFilter(category.id)}
              >
                {category.name}
              </Checkbox>
            </Box>
          ))}
        </Box>
      </Box>

      <EventsList events={filteredEvents} eventCategories={eventCategories} />

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="green"
          onClick={() => setAddEvent(true)}
          mb={"2rem"}
        >
          Add Event
        </Button>
      </Box>
      <AddEvent
        isOpen={addEvent}
        onClose={() => setAddEvent(false)}
        events={eventsList}
        setEventsList={setEventsList}
        eventCategories={eventCategories}
      />
    </>
  );
};
