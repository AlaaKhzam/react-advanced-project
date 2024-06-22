import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="gray.200" p={4}>
      <nav>
        <Flex justify="space-between">
          <Link to="/">
            <Text fontSize="lg" fontWeight="bold">
              Events Page
            </Text>
          </Link>
        </Flex>
      </nav>
    </Box>
  );
};
