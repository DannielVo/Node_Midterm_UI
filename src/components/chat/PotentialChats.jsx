import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  if (!potentialChats.length) {
    return (
      <div className="empty-state">No users available to start a chat</div>
    );
  }

  return (
    <div className="all-users">
      {potentialChats.map((u) => (
        <div
          className="single-user"
          key={u._id}
          onClick={() => createChat(user._id, u._id)}
        >
          <div className="user-avatar">{u.name?.charAt(0)}</div>
          <div className="user-info">{u.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PotentialChats;
