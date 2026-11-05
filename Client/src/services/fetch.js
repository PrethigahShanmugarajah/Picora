// Client / src / services / fetch.js
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import toast from "react-hot-toast";

/* -------- Fetch User -------- */
export const fetchUser = async () => {
  try {
    const { data } = await api.get(API_ROUTES.AUTH.ME);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch User Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to fetch user information.");
      console.error(
        "Fetch User Error:",
        data?.message || "Unable to fetch user information.",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch User Error:", error);

    throw error;
  }
};

/* -------- Fetch Stats -------- */
export const fetchStats = async () => {
  try {
    const { data } = await api.get(API_ROUTES.MEDIA.STATS);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Stats Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to fetch statistics.");
      console.error("Fetch Stats Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Stats Error:", error);

    throw error;
  }
};

/* -------- Fetch Photos -------- */
export const fetchPhotos = async (params = {}) => {
  try {
    const { data } = await api.get(API_ROUTES.MEDIA.BASE, { params });

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Photos Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to fetch photos.");
      console.error("Fetch Photos Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Photos Error:", error);

    throw error;
  }
};
