import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export const useUserStatus = () => {
  const socketRef = useSocket();
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>({});
 

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleUserStatus = ({ userId, online }: { userId: string; online: boolean }) => {
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: online,
      }));
    };

    const handleInitialStatuses = (statusList: { userId: string; online: boolean }[]) => {
      const newMap: Record<string, boolean> = {};
      for (const { userId, online } of statusList) {
        newMap[userId] = online;
      }
      setUserStatuses(newMap);
    };

    socket.on("userStatus", handleUserStatus);
    socket.on("initialUserStatuses", handleInitialStatuses);

    return () => {
      socket.off("userStatus", handleUserStatus);
      socket.off("initialUserStatuses", handleInitialStatuses);
    };
  }, [socketRef]);

  // Si querés asegurarte de que vos estés online
  const setSelfOnline = (id: string) => {
    setUserStatuses((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return { userStatuses, setSelfOnline };
};
