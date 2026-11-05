// Client / src / services / mutations.js
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import toast from "react-hot-toast";

/* -------- Login User -------- */
export const loginUser = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, payload);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Login User Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to login.");
      console.error("Login User Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Login User Error:", error);

    throw error;
  }
};

/* -------- Register User -------- */
export const registerUser = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.AUTH.REGISTER, payload);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Register User Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to create your account.");
      console.error("Register User Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Register User Error:", error);

    throw error;
  }
};

/* -------- Toggle Favorite -------- */
export const toggleFavorite = async (id) => {
  try {
    const { data } = await api.patch(API_ROUTES.MEDIA.FAVORITE(id));

    if (data?.success) {
      toast.success(data?.message);
      console.log("Toggle Favorite Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to update favorite.");
      console.error("Toggle Favorite Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Toggle Favorite Error:", error);

    throw error;
  }
};

/* -------- Move to Trash -------- */
export const moveToTrash = async (id) => {
  try {
    const { data } = await api.patch(API_ROUTES.MEDIA.TRASH(id), {
      restore: false,
    });

    if (data?.success) {
      toast.success(data?.message);
      console.log("Move to Trash Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to move media to trash.");
      console.error("Move to Trash Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Move to Trash Error:", error);

    throw error;
  }
};

/* -------- Upload Media -------- */
export const uploadMedia = async (formData) => {
  try {
    const { data } = await api.post(API_ROUTES.MEDIA.UPLOAD, formData);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Upload Media Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to upload media.");
      console.error("Upload Media Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Unable to upload media.");
    console.error("Upload Media Error:", error);

    throw error;
  }
};

/* -------- Create Album -------- */
export const createAlbum = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.ALBUM.BASE, payload);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Create Album Success:", data?.message);
    } else {
      toast.error(data?.message || "Unable to create album.");
      console.error("Create Album Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Unable to create album.");
    console.error("Create Album Error:", error);

    throw error;
  }
};
