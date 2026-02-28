import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

function useSocket(barterId, onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to backend
    socketRef.current = io(SOCKET_URL);

    // Join specific barter room
    if (barterId) {
      socketRef.current.emit("joinRoom", barterId);
    }

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (message) => {
      if (onMessageReceived) {
        onMessageReceived(message);
      }
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [barterId, onMessageReceived]);

  // Send message function
  const sendMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", data);
    }
  };

  return { sendMessage };
}

export default useSocket;