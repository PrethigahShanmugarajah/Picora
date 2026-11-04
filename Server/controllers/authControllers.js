// Server / controllers / authControllers.js
import { validatePassword } from "../utils/passwordValidator.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/token.js";

/* -------- Register User -------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a valid string.",
      });
    }

    if (typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email must be a valid string.",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password must be a valid string.",
      });
    }

    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Register User Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating your account.",
      error: `Register User Error: ${error?.stack || error?.message || error}`,
    });
  }
};
