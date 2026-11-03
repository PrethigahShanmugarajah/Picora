// Server / config / db.js
import mongoose from "mongoose";
import { mongodbUri, projectName } from "./env.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected!"),
    );

    let mongodbURI = mongodbUri;
    const databaseName = projectName;

    if (mongodbURI.endsWith("/")) {
      mongodbURI = mongodbURI.slice(0, -1);
    }

    await mongoose.connect(`${mongodbURI}/${databaseName}`, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;
