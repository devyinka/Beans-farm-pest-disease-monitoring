import { io } from "socket.io-client";

const BACKENDURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Create a Socket.IO client instance with autoConnect disabled for manual control.
export const FarmSocket = io(BACKENDURL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  transports: ["polling", "websocket"],
  withCredentials: true,
});

// Function to connect the socket, optionally with an auth token for secure endpoints.
export const connectSocket = (token?: string) => {
  if (token) {
    FarmSocket.auth = { token };
  }
  FarmSocket.connect();
};

export const disconnectSocket = () => {
  FarmSocket.disconnect();
};
