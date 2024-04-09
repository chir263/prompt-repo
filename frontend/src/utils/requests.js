import axios from "axios";

const accessString = (accessToken) =>
  `?access_token=${accessToken || localStorage.getItem("accessToken")}`;

const get = async (url, accessToken) => {
  try {
    const response = await axios.get(url + accessString(accessToken), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

const post = async (url, body, accessToken) => {
  try {
    const response = await axios.post(url + accessString(accessToken), body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

const delete_ = async (url, body, accessToken) => {
  try {
    const response = await axios.delete(url + accessString(accessToken), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: body,
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return {
      error: error?.response?.data || error?.message || error,
    };
  }
};

export { get, post, delete_ };
