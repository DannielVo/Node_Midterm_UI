import { useContext, useMemo } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/chatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const {
    userChats,
    isUserChatsLoading,
    updateCurrentChat,
    currentChat,
    message,
  } = useContext(ChatContext);

  const sortedChats = useMemo(() => {
    if (!userChats) return [];

    return [...userChats].sort((a, b) => {
      const aLast = message
        ?.filter((m) => m.chatId === a._id)
        ?.slice(-1)[0]?.createdAt;

      const bLast = message
        ?.filter((m) => m.chatId === b._id)
        ?.slice(-1)[0]?.createdAt;

      return new Date(bLast || 0) - new Date(aLast || 0);
    });
  }, [userChats, message]);

  return (
    <Container className="chat-layout">
      <PotentialChats />

      <Stack direction="horizontal" gap={3} style={{ height: "100%" }}>
        <Stack className="chat-sidebar">
          {isUserChatsLoading && <p>Loading chats...</p>}
          {sortedChats.map((chat) => (
            <div key={chat._id} onClick={() => updateCurrentChat(chat)}>
              <UserChat
                chat={chat}
                user={user}
                isActive={currentChat?._id === chat._id}
              />
            </div>
          ))}
        </Stack>

        <div className="chat-main ">
          {currentChat ? <ChatBox /> : <p>Select a chat</p>}
        </div>
      </Stack>
    </Container>
  );
};

export default Chat;
