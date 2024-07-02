import React, { useState, useEffect } from "react";
import { Box, Textarea, Heading, VStack, Text } from "@chakra-ui/react";

const LogOutput = () => {
  const [logs, setLogs] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate log fetching
    const fetchLogs = async () => {
      try {
        // Replace with actual log fetching logic
        const response = await fetch("/api/logs");
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await response.text();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Box p={5}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">Log Output</Heading>
        {error && (
          <Text color="red.500" fontSize="md">
            Error: {error}
          </Text>
        )}
        <Textarea
          value={logs}
          readOnly
          placeholder="Log output will appear here..."
          size="lg"
          height="400px"
        />
      </VStack>
    </Box>
  );
};

export default LogOutput;