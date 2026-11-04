// Server / server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { port } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRouters.js";

/* -------- INITIALIZE EXPRESS -------- */
const app = express();

/* -------- CONNECT TO DATABASE -------- */
connectDB();

/* -------- MIDDLEWARE CONFIGURATION -------- */
app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* -------- ROUTES -------- */
app.get("/", (req, res) => res.send("API is Working!"));
app.use("/api/auth", authRouter);

app.use((error, _req, res, _next) => {
  console.error(error?.stack || error?.message || error);
  res.status(500).json({
    message: error?.stack || error?.message || error || "Internal Server Error",
  });
});

/* -------- PORT -------- */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
