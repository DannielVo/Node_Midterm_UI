import { createContext, useCallback, useEffect, useState, useRef } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const socketRef = useRef(null);
  console.log("online users", onlineUser);
  console.log("🚀 ~ ChatContextProvider ~ notifications:", notifications);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:3000", {
      query: { userId: user._id },
    });

    socketRef.current = socket;

    // ===== online users =====
    const handleOnlineUsers = (users) => {
      setOnlineUser(users);
    };

    // ===== message =====
    const handleMessage = (msg) => {
      setMessage((prev) => [...prev, msg]);

      setUserChats((prevChats) => {
        if (!prevChats) return prevChats;

        const chatIndex = prevChats.findIndex(
          (chat) => chat._id === msg.chatId
        );

        if (chatIndex === -1) return prevChats;

        const updatedChats = [...prevChats];
        const [chatToMove] = updatedChats.splice(chatIndex, 1);

        return [chatToMove, ...updatedChats];
      });
    };

    // ===== notification =====
    const handleNotification = (res) => {
      setNotifications((prev) => {
        const isChatOpened = currentChat?._id === res.chatId;

        return [{ ...res, isRead: isChatOpened }, ...prev];
      });
    };

    // register listeners
    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("getMessage", handleMessage);
    socket.on("getNotification", handleNotification);

    // emit after listeners registered
    socket.emit("addNewUser", user._id);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("getMessage", handleMessage);
      socket.off("getNotification", handleNotification);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, currentChat?._id]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("fetching error users", response);
      }
      const users = Array.isArray(response?.data) ? response.data : [];
      const pChats = users.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] == u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUser(users);
    };

    getUsers();
  }, [userChats, user]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    if (!currentChat?._id) {
      console.log("no any chat");
      return;
    }

    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessageError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat._id}`
      );

      setIsMessageLoading(false);
      if (response.error) {
        return setMessageError(response);
      }

      setMessage(Array.isArray(response) ? response : []);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return;

      const response = await postRequest(
        `${baseUrl}/messages/`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender?._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      const newMsg = response?.data ?? response;

      // emit realtime
      socketRef.current?.emit("sendMessage", {
        ...newMsg,
        recipientId: currentChat.members.find((id) => id !== sender._id),
      });

      setMessage((prev) => [...prev, newMsg]);
      setTextMessage("");
    },
    [currentChat]
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstUserId, secondUserId) => {
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstUserId, secondUserId })
    );
    if (response.error) {
      return console.log("error in create chat", response);
    }
    const newChat = response?.data ?? response;
    setUserChats((prev) => [...prev, newChat]);
  }, []);

  const markNotification = useCallback((notification) => {
    const mNotifications = notification.map((n) => {
      return {
        ...n,
        isRead: true,
      };
    });

    setNotifications(mNotifications);
  }, []);

  const markEachasRead = useCallback((n, userChats, user, notification) => {
    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });
      return isDesiredChat;
    });

    const mNotifications = notification.map((el) => {
      if (n.senderId === el.senderId) {
        return {
          ...n,
          isRead: true,
        };
      } else {
        return el;
      }
    });
    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
  }, []);

  const markThisUserRead = useCallback(
    (thisUserNotifications, notification) => {
      const mNotifications = notification.map((el) => {
        let noti;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            noti = { ...n, isRead: true };
          } else {
            noti = el;
          }
        });
        return noti;
      });
      setNotifications(mNotifications);
    },

    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        notifications,
        message,
        onlineUser,
        isMessageLoading,
        messageError,
        currentChat,
        sendTextMessage,
        allUser,
        markNotification,
        markEachasRead,
        markThisUserRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
