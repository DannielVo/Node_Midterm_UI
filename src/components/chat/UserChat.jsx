import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { onlineUser, notifications, markThisUserRead } =
    useContext(ChatContext);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const { latestMessage } = useFetchLatestMessage(chat);
  const { recipientUser } = useFetchRecipient(chat, user);
  const isOnline = onlineUser?.some((u) => u.userId === recipientUser?._id);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser._id
  );

  const truncate = (text, max = 30) =>
    text.length > max ? text.slice(0, max) + "…" : text;
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex p-1 flex-grow-1">
        {isOnline && <span className="user-online" />}

        <div className="avatar-wrapper ">
          <img src={avatar} height="40" alt="avatar" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && <span>{truncate(latestMessage.text)}</span>}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
      </div>
    </Stack>
  );
};

export default UserChat;
