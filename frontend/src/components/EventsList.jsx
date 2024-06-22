import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Badge,
  Grid,
  GridItem,
  AspectRatio,
  Heading,
} from "@chakra-ui/react";

export const EventsList = ({ events, eventCategories }) => {
  // Function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = eventCategories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : "";
  };

  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
      gap={4}
      margin="3rem"
      justifyContent="center"
      justifyItems="center"
      width="auto"
    >
      {events.map((event) => (
        <GridItem key={event.id}>
          <Link to={`/event/${event.id}`}>
            <Box
              borderWidth="2px"
              borderRadius="lg"
              overflow="hidden"
              padding="1rem"
            >
              <Box textAlign="center" margin="1rem">
                <Heading fontSize="xl">{event.title}</Heading>
              </Box>
              <AspectRatio ratio={25 / 20}>
                <Image
                  src={event.image ? event.image : "../src/utils/newevent.jpeg"}
                  alt={event.title}
                  objectFit="cover"
                />
              </AspectRatio>
              <Text mt={4}>{event.description}</Text>
              <Text>{`Start Time: ${event.startTime} - End Time: ${event.endTime}`}</Text>
              <Text>
                Categories:{" "}
                {event.categoryIds.map((categoryId) => (
                  <Badge key={categoryId} colorScheme="teal" mr={2}>
                    {getCategoryNameById(categoryId)}
                  </Badge>
                ))}
              </Text>
            </Box>
          </Link>
        </GridItem>
      ))}
    </Grid>
  );
};
