// Server / config / env.js

export const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable not set!");
}

export const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error("MONGODB_URI environment variable not set!");
}

export const projectName = process.env.PROJECT_NAME;
if (!projectName) {
  throw new Error("PROJECT_NAME environment variable not set!");
}
