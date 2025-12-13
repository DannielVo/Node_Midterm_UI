export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        error: true,
        message: data?.message,
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    return {
      error: true,
      message: "Network error",
    };
  }
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};
