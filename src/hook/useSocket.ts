import { useEffect } from "react";
import { Socket } from "socket.io-client";

// Custom hook to manage Socket.IO event listeners
export const useSocket = <T>(
  socket: Socket,
  event: string,
  handler: (data: T) => void,
): Socket | null => {
  useEffect(() => {
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);

  return socket;
};
