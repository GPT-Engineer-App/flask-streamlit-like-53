import React from "react";
import { Box, Button, VStack, Heading, IconButton } from "@chakra-ui/react";
import { FaHome, FaCog, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Box width={{ base: "full", md: "250px" }} bg="gray.200" height="full" padding={4}>
      <VStack align="start" spacing={4}>
        <IconButton aria-label="Menu" icon={<FaHome />} size="lg" variant="ghost" isRound />
        <Heading size="md">MyApp</Heading>
        <Button as={Link} to="/" leftIcon={<FaHome />} variant="solid">
          Home
        </Button>
        <Button as={Link} to="/settings" leftIcon={<FaCog />} variant="solid">
          Settings
        </Button>
        <Button as={Link} to="/live-stream" leftIcon={<FaVideo />} variant="solid">
          Live Stream
        </Button>
      </VStack>
    </Box>
  );
};

const SidebarLayout = ({ children }) => {
  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1 }}>
        {children}
      </main>
    </Flex>
  );
};

export default SidebarLayout;