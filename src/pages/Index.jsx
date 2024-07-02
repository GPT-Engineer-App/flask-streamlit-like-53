import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Input, Stack, Text, VStack, useColorModeValue, IconButton, Divider, Radio, RadioGroup } from "@chakra-ui/react";
import { FaSun, FaMoon, FaBars, FaVideo, FaStop } from "react-icons/fa";

const Index = () => {
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");
  const [communicationMethod, setCommunicationMethod] = useState("WebSockets");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);

  useEffect(() => {
    let eventSource;
    let socket;

    if (isStreaming) {
      if (communicationMethod === "SSE") {
        eventSource = new EventSource("https://www.codehooks.io/your-sse-endpoint");
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setDetectedObjects(data.objects);
        };
      } else if (communicationMethod === "WebSockets") {
        socket = new WebSocket("wss://www.codehooks.io/your-websocket-endpoint");
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setDetectedObjects(data.objects);
        };
      }
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (socket) {
        socket.close();
      }
    };
  }, [isStreaming, communicationMethod]);

  const handleStartStream = () => {
    setIsStreaming(true);
    // Add logic to start video feed and object detection
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setDetectedObjects([]);
    // Add logic to stop video feed and object detection
  };

  return (
    <Box flex="1" bg={bg} color={color} p={5}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading mb={4}>Live Stream</Heading>
        <IconButton aria-label="Toggle theme" icon={useColorModeValue(<FaMoon />, <FaSun />)} onClick={() => console.log("Toggle theme")} isRound />
      </Flex>
      <Divider mb={4} />
      <Stack spacing={4}>
        <Text fontSize="xl">Select Communication Method:</Text>
        <RadioGroup onChange={setCommunicationMethod} value={communicationMethod}>
          <Stack direction="row">
            <Radio value="WebSockets">WebSockets</Radio>
            <Radio value="SSE">Server-Sent Events (SSE)</Radio>
          </Stack>
        </RadioGroup>
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Button leftIcon={<FaVideo />} colorScheme="green" onClick={handleStartStream} isDisabled={isStreaming}>
            Start Live Stream
          </Button>
          <Button leftIcon={<FaStop />} colorScheme="red" onClick={handleStopStream} isDisabled={!isStreaming}>
            Stop Live Stream
          </Button>
        </Flex>
        <Box mt={4} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <Text fontSize="lg" mb={2}>Video Feed:</Text>
          <Box bg="black" height="300px" mb={4}></Box>
          <Text fontSize="lg" mb={2}>Detected Objects:</Text>
          <Box bg="gray.200" p={4} borderRadius="md" height="150px" overflowY="auto">
            {detectedObjects.length > 0 ? (
              detectedObjects.map((obj, index) => (
                <Text key={index}>{obj}</Text>
              ))
            ) : (
              <Text>No objects detected.</Text>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Index;