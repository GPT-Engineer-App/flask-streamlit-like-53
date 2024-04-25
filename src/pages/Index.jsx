import React from "react";
import { Box, Button, Flex, Heading, Input, Stack, Text, VStack, useColorModeValue, IconButton, Divider } from "@chakra-ui/react";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";

const Index = () => {
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      {/* Sidebar */}
      <Box width={{ base: "full", md: "250px" }} bg={useColorModeValue("gray.200", "gray.900")} height="full" padding={4}>
        <VStack align="start" spacing={4}>
          <IconButton aria-label="Menu" icon={<FaBars />} size="lg" variant="ghost" isRound />
          <Heading size="md">Navigation</Heading>
          <Button leftIcon={<FaSun />} variant="solid">
            Dashboard
          </Button>
          <Button leftIcon={<FaMoon />} variant="solid">
            Reports
          </Button>
          <Button leftIcon={<FaBars />} variant="solid">
            Settings
          </Button>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" bg={bg} color={color} p={5}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading mb={4}>Dashboard</Heading>
          <IconButton aria-label="Toggle theme" icon={useColorModeValue(<FaMoon />, <FaSun />)} onClick={() => console.log("Toggle theme")} isRound />
        </Flex>
        <Divider mb={4} />
        <Stack spacing={4}>
          <Text fontSize="xl">Welcome to your dashboard!</Text>
          <Input placeholder="Search..." size="lg" />
          <Button rightIcon={<FaBars />} colorScheme="blue">
            Submit
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Index;
