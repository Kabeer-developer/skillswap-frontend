import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

function useSocket(barterId, onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      transports: ["polling"],
    });

    if (barterId) {
      socketRef.current.emit("joinRoom", barterId);
    }

    socketRef.current.on("receiveMessage", (message) => {
      if (onMessageReceived) {
        onMessageReceived(message);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [barterId, onMessageReceived]);

  const sendMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", data);
    }
  };

  return { sendMessage };
}

export default useSocket;