import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, message, isMessageLoading, sendTextMessage } =
    useContext(ChatContext);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showNewMessagesBtn, setShowNewMessagesBtn] = useState(false);

  const { recipientUser, loading: isRecipientLoading } = useFetchRecipient(
    currentChat,
    user
  );

  // Scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  // 1️⃣ Chưa chọn chat
  if (!currentChat) {
    return (
      <div className="chat-empty">Select a conversation to start chatting</div>
    );
  }

  // 2️⃣ Loading user hoặc message
  if (isRecipientLoading || isMessageLoading) {
    return <div className="chat-loading">Loading...</div>;
  }
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setShowNewMessagesBtn(distanceFromBottom > 50); // >50px => hiển thị nút
  };
  const handleSend = () => {
    if (textMessage.trim() === "") return;
    sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
  };

  return (
    <Stack gap={3} className="chat-box">
      {/* Header */}
      <div className="chat-header d-flex align-items-center justify-content-between px-3 py-2">
        <div className="d-flex align-items-center">
          <div className="avatar-wrapper me-2">
            <img
              src={"src/assets/avatar.svg"}
              alt={recipientUser?.name}
              className="user-avatar"
            />
            {recipientUser?.isOnline && <span className="user-online" />}
          </div>
          <div className="user-info">
            <div className="user-name">{recipientUser?.name}</div>
            <div className="user-status">
              {recipientUser?.isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <Stack
        gap={2}
        className="messages"
        style={{ overflowY: "auto", maxHeight: "70vh" }}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {message.length === 0 && <p className="text-muted">No messages yet</p>}

        {message?.filter(Boolean).map((m) => (
          <Stack
            key={m._id}
            className={`message ${
              m.senderId === user?._id
                ? "self align-self-end message-text-self "
                : "align-self-start message-text"
            }`}
          >
            <span className="">{m.text}</span>
            <span className="message-footer text-muted">
              {moment(m.createdAt).calendar()}
            </span>
          </Stack>
        ))}

        {/* Dummy div để scroll */}
        <div ref={messagesEndRef} />
      </Stack>

      <Stack
        direction="vertical"
        gap={1}
        className="chat-input-wrapper flex-grow-0"
        style={{ position: "relative" }}
      >
        {/* Sticky New Messages */}
        {showNewMessagesBtn && (
          <button
            onClick={() => {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
              setShowNewMessagesBtn(false);
            }}
            style={{
              position: "absolute", // sticky so với input wrapper
              bottom: "100px", // cách input 50px, chỉnh tùy ý
              left: "50%",
              transform: "translateX(-50%)",
              padding: "8px 15px",
              borderRadius: "20px",
              backgroundColor: "#4870DF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              zIndex: 100,
            }}
          >
            Go back to newest
          </button>
        )}

        {/* Input */}
        <Stack
          direction="horizontal"
          gap={3}
          className="chat-input flex-grow-0 input"
        >
          <div className="flex-grow-1 overflow-hidden">
            <InputEmoji
              value={textMessage}
              onChange={setTextMessage}
              fontFamily="nunito"
              borderColor="rgba(72,112,223,0.2)"
              placeholder="Type a message..."
              onEnter={handleSend}
            />
          </div>
          <button className="send-btn flex-shrink-0" onClick={handleSend}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
