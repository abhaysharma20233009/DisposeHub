import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../assets/loading.json";

const socket = io("http://localhost:3000");

const NotificationDropdown = ({ sendData }) => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const firebaseUID = localStorage.getItem("firebaseUID");

    socket.emit("fetchNotifications", { firebaseUID });

    socket.on("allNotifications", (fetchedNotifications) => {
      const updated = fetchedNotifications.map((notif) => ({
        messagePreview: notif.messagePreview,
      }));
      setNotifications(updated);
      setCount(updated.length);
      setIsLoading(false);
    });

    socket.on("newMessageNotification", (data) => {
      setNotifications((prev) => [
        ...prev,
        { messagePreview: data.messagePreview },
      ]);
      setCount((prevCount) => prevCount + 1);
    });

    socket.on("notificationsMarkedAsRead", () => {
      setNotifications([]);
      setCount(0);
    });

    return () => {
      socket.off("newMessageNotification");
      socket.off("allNotifications");
      socket.off("notificationsMarkedAsRead");
    };
  }, []);

  useEffect(() => {
    sendData(count);
  }, [count, sendData]);

  const markAsRead = () => {
    const firebaseUID = localStorage.getItem("firebaseUID");
    socket.emit("markNotificationsAsRead", { firebaseUID });
  };

  return (
    <div className="absolute z-50 right-0 mt-6 w-80 bg-gray-900/80 backdrop-blur-2xl border border-cyan-500 shadow-xl rounded-2xl p-4 bell-dropdown transition-all duration-300 ease-in-out hover:shadow-cyan-500/50">
      <h3 className="text-lg font-semibold text-cyan-300 flex justify-between items-center">
        Notifications <span className="text-cyan-400">({count})</span>
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <Player src={loadingAnimation} className="w-16 h-16" autoplay loop />
        </div>
      ) : count === 0 ? (
        <p className="text-gray-400 text-center py-4">No new notifications</p>
      ) : (
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {notifications.map((notif, index) => (
            <div
              key={index}
              className="p-3 border-b border-gray-600 hover:bg-gray-800/50 transition-all duration-200 rounded-lg"
            >
              <p className="text-sm text-gray-300">{notif.messagePreview}</p>
            </div>
          ))}
        </div>
      )}

      {count > 0 && !isLoading && (
        <button
          className="text-sm text-cyan-300 mt-3 w-full py-2 bg-gray-800/50 border border-cyan-500 rounded-lg transition-all hover:bg-cyan-500/30 hover:text-white shadow-md hover:shadow-cyan-500"
          onClick={markAsRead}
        >
          Mark all as Read
        </button>
      )}
    </div>
  );
};

export default NotificationDropdown;
