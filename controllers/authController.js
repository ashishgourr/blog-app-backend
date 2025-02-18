import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

//load the environment variables
dotenv.config();

// Middleware to authenticate JWT

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  //const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    console.log("Verifying token...");
    // Verify the token using JWT_SECRET

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Token decoded:", decoded);

    // Attach the user ID to the request object so it can be accessed later
    req.user = decoded;
    req.user = { userId: decoded.id };

    console.log("Decoded UserId:", decoded.id);

    // Pass control to the next handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Register User
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("User already exists:", username);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username: username, password: hashedPassword });
    // Save the new user to the database
    await newUser.save();

    console.log("User registered successfully:", newUser);
    // Return success message with status 201
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Logging in user with username:", username);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with the hashed password in the database
    console.log("Comparing passwords...");

    console.log("Password entered:", password);
    console.log("Hashed password in DB:", user.password);

    const newHashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { username: username },
      { password: newHashedPassword }
    );

    console.log("New Hashed password in DB:", newHashedPassword);

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password.trim()
    );

    console.log("Password match result:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("Invalid credentials for user:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token

    console.log("Generating JWT token...");

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful for user:", username);

    return res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default authenticateJWT;
