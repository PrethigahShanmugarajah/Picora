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
    });
  }
};

/* -------- Login User -------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    if (!email) {
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

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account was found with the provided email address.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Password authentication is not available for this account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "The password you entered is incorrect.",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "You have logged in successfully.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while logging in.",
    });
  }
};

/* -------- Get Current User -------- */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The requested user account could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your profile has been retrieved successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving your profile.",
    });
  }
};
