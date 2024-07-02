import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Flex, Heading, Input, Stack, Text, VStack, useColorModeValue, IconButton, Divider, Radio, RadioGroup } from "@chakra-ui/react";
import { FaSun, FaMoon, FaBars, FaVideo, FaStop } from "react-icons/fa";
import * as tf from '@tensorflow/tfjs';
import * as yolo from '@tensorflow-models/coco-ssd';

const Index = () => {
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");
  const [communicationMethod, setCommunicationMethod] = useState("WebSockets");
  const [detectionMethod, setDetectionMethod] = useState("YOLOv5");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [rawDetections, setRawDetections] = useState([]);
  const videoRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await yolo.load();
        modelRef.current = model;
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading model: ", error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    let eventSource;
    let socket;

    if (isStreaming) {
      if (communicationMethod === "SSE") {
        eventSource = new EventSource(`https://www.codehooks.io/your-sse-endpoint?detectionMethod=${detectionMethod}`);
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setDetectedObjects(data.objects);
          setRawDetections(data.rawDetections);
        };
      } else if (communicationMethod === "WebSockets") {
        socket = new WebSocket(`wss://www.codehooks.io/your-websocket-endpoint?detectionMethod=${detectionMethod}`);
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setDetectedObjects(data.objects);
          setRawDetections(data.rawDetections);
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
  }, [isStreaming, communicationMethod, detectionMethod]);

  const handleStartStream = async () => {
    setIsStreaming(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        detectFrame(videoRef.current);
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setDetectedObjects([]);
    setRawDetections([]);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const detectFrame = async (video) => {
    if (modelRef.current && isStreaming) {
      const predictions = await modelRef.current.detect(video);
      setDetectedObjects(predictions.map(pred => pred.class));
      setRawDetections(predictions);
      requestAnimationFrame(() => detectFrame(video));
    }
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
        <Text fontSize="xl">Select Detection Method:</Text>
        <RadioGroup onChange={setDetectionMethod} value={detectionMethod}>
          <Stack direction="row">
            <Radio value="YOLOv5">YOLOv5</Radio>
            <Radio value="SSD">SSD</Radio>
            <Radio value="Faster R-CNN">Faster R-CNN</Radio>
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
          <Box bg="black" height="300px" mb={4}>
            <video ref={videoRef} autoPlay style={{ width: "100%", height: "100%" }}></video>
          </Box>
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
          <Text fontSize="lg" mb={2}>Raw Detection Results:</Text>
          <Box bg="gray.200" p={4} borderRadius="md" height="150px" overflowY="auto">
            {rawDetections.length > 0 ? (
              rawDetections.map((detection, index) => (
                <Text key={index}>{JSON.stringify(detection)}</Text>
              ))
            ) : (
              <Text>No raw detections.</Text>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Index;