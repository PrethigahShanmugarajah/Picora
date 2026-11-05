// Client / src / api / api_route.js

const API_ROUTES = {
  AUTH: {
    ME: "/api/auth/me",
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },

  MEDIA: {
    STATS: "/api/media/stats",
    BASE: "/api/media",
    FAVORITE: (id) => `/api/media/${id}/favorite`,
    TRASH: (id) => `/api/media/${id}/trash`,
    UPLOAD: "/api/media/upload",
    TRASH_BASE: "/api/media/trash",
    EMPTY_TRASH: "/api/media/trash/empty",
  },

  ALBUM: {
    BASE: "/api/albums",
  },
};

export default API_ROUTES;
