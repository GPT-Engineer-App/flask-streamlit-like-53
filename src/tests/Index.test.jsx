import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Index from '../pages/Index.jsx';

describe('Index Page', () => {
  test('renders Live Stream heading', () => {
    render(<Index />);
    expect(screen.getByText('Live Stream')).toBeInTheDocument();
  });

  test('toggles communication method', () => {
    render(<Index />);
    const websocketRadio = screen.getByLabelText('WebSockets');
    const sseRadio = screen.getByLabelText('Server-Sent Events (SSE)');
    fireEvent.click(sseRadio);
    expect(sseRadio).toBeChecked();
    fireEvent.click(websocketRadio);
    expect(websocketRadio).toBeChecked();
  });

  test('starts and stops live stream', () => {
    render(<Index />);
    const startButton = screen.getByText('Start Live Stream');
    const stopButton = screen.getByText('Stop Live Stream');
    fireEvent.click(startButton);
    expect(startButton).toBeDisabled();
    expect(stopButton).toBeEnabled();
    fireEvent.click(stopButton);
    expect(stopButton).toBeDisabled();
    expect(startButton).toBeEnabled();
  });

  test('displays detected objects', () => {
    render(<Index />);
    const startButton = screen.getByText('Start Live Stream');
    fireEvent.click(startButton);
    // Mock detected objects
    const detectedObjects = ['Object 1', 'Object 2'];
    detectedObjects.forEach(obj => {
      expect(screen.getByText(obj)).toBeInTheDocument();
    });
  });
});