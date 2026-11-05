import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import toast from "react-hot-toast";

/* -------- Login User -------- */
export const loginUser = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, payload);

    if (data?.success) {
      toast.success(data?.message);
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

/* -------- Update Media Trash Status -------- */
export const updateMediaTrash = async (id, restore = false) => {
  try {
    const { data } = await api.patch(API_ROUTES.MEDIA.TRASH(id), {
      restore,
    });

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to update media trash status.");
      console.error("Update Media Trash Status Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Unable to update media trash status.",
    );
    console.error("Update Media Trash Status Error:", error);

    throw error;
  }
};

/* -------- Upload Media -------- */
export const uploadMedia = async (formData) => {
  try {
    const { data } = await api.post(API_ROUTES.MEDIA.UPLOAD, formData);

    if (data?.success) {
      toast.success(data?.message);
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

/* -------- Delete Album -------- */
export const deleteAlbum = async (id) => {
  try {
    const { data } = await api.delete(`${API_ROUTES.ALBUM.BASE}/${id}`);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to delete album.");
      console.error("Delete Album Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Unable to delete album.");
    console.error("Delete Album Error:", error);

    throw error;
  }
};

/* -------- Empty Trash -------- */
export const emptyTrash = async () => {
  try {
    const { data } = await api.delete(API_ROUTES.MEDIA.EMPTY_TRASH);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to empty trash.");
      console.error("Empty Trash Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Unable to empty trash.");
    console.error("Empty Trash Error:", error);

    throw error;
  }
};

/* -------- Permanently Delete Media -------- */
export const deleteMediaPermanent = async (id) => {
  try {
    const { data } = await api.delete(`${API_ROUTES.MEDIA.BASE}/${id}`);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to permanently delete media.");
      console.error("Permanently Delete Media Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Unable to permanently delete media.",
    );
    console.error("Permanently Delete Media Error:", error);

    throw error;
  }
};

/* -------- Remove Photo From Album -------- */
export const removePhotoFromAlbum = async (albumId, photoId) => {
  try {
    const { data } = await api.delete(
      `${API_ROUTES.ALBUM.BASE}/${albumId}/photos/${photoId}`,
    );

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to remove photo from album.");
      console.error("Remove Photo From Album Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Unable to remove photo from album.",
    );
    console.error("Remove Photo From Album Error:", error);

    throw error;
  }
};

/* -------- Add Photos To Album -------- */
export const addPhotosToAlbum = async (albumId, photoIds) => {
  try {
    const { data } = await api.post(
      `${API_ROUTES.ALBUM.BASE}/${albumId}/photos`,
      { photoIds },
    );

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message || "Unable to add photos to album.");
      console.error("Add Photos To Album Error:", data?.message);
    }

    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Unable to add photos to album.",
    );
    console.error("Add Photos To Album Error:", error);

    throw error;
  }
};
