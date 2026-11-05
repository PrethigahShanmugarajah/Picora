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
