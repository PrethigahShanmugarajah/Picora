// Server / utils / passwordValidator.js

/* -------- Validate Password -------- */
export const validatePassword = (password) => {
  if (typeof password !== "string") {
    return "Password must be a valid string.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter (A-Z).";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter (a-z).";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number (0-9).";
  }

  return null;
};
