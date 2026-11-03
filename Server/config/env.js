// Server / config / env.js

export const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable not set!");
}
