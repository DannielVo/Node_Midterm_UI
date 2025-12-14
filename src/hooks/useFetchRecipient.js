import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id && id !== user?._id);

  useEffect(() => {
    if (!recipientId) {
      // setRecipientUser(null);
      return;
    }

    const getUser = async () => {
      setLoading(true);
      setError(null);

      const response = await getRequest(`${baseUrl}/users/${recipientId}`);

      setLoading(false);

      if (response?.error) {
        setError(response);
        return;
      }

      setRecipientUser(response.data);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, loading, error };
};
