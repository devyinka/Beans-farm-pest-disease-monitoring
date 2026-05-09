import { createContext, useContext, useEffect, useState } from "react";
import { FarmSocket, connectSocket } from "@/socket/socket";

interface SocketContextType {
  socket: typeof FarmSocket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(FarmSocket.connected);

  useEffect(() => {
    // Connect socket on mount
    connectSocket();

    const handleConnect = () => {
      console.info("Socket.IO connected (frontend):", FarmSocket.id);
      setIsConnected(true);
    };
    const handleDisconnect = (reason: string) => {
      console.info("Socket.IO disconnected (frontend):", reason);
      setIsConnected(false);
    };
    const handleConnectError = (error: any) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    };

    FarmSocket.on("connect", handleConnect);
    FarmSocket.on("disconnect", handleDisconnect);
    FarmSocket.on("connect_error", handleConnectError);

    return () => {
      FarmSocket.off("connect", handleConnect);
      FarmSocket.off("disconnect", handleDisconnect);
      FarmSocket.off("connect_error", handleConnectError);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: FarmSocket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketStatus = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketStatus must be used within SocketProvider");
  }
  return context;
};
