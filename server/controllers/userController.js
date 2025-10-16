import User from "../models/userSchema.js";
import Resume from "../models/resumeSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Generate JWT Token
const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// User Registration Controller
//POST : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save new user to database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success response
    const token = generateToken(newUser._id);
    newUser.password = undefined; // Hide password in response
    return res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    // console.error("Error registering user:", error);
    return res.status(500).json({ message: error.message });
  }
};

// User Login Controller
//POST : /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    user.password = undefined; // Hide password in response
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    // console.error("Error logging in user:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get User by ID
//GET : /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined; // Hide password in response
    return res.status(200).json({ user });
  } catch (error) {
    // console.error("Error fetching user data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// User Resumes Controller
//POST : /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ user: userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    // console.error("Error fetching user resumes:", error);
    return res.status(500).json({ message: error.message });
  }
};
