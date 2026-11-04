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

export const jwtSecret = process.env.JWT_SECRET?.trim();
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable not set!");
}

export const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim();
if (!jwtExpiresIn) {
  throw new Error("JWT_EXPIRES_IN environment variable not set!");
}

export const imagekitPublicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
if (!imagekitPublicKey) {
  throw new Error("IMAGEKIT_PUBLIC_KEY environment variable not set!");
}

export const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
if (!imagekitPrivateKey) {
  throw new Error("IMAGEKIT_PRIVATE_KEY environment variable not set!");
}

export const imagekitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
if (!imagekitUrlEndpoint) {
  throw new Error("IMAGEKIT_URL_ENDPOINT environment variable not set!");
}
