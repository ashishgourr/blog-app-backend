import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const PORT = process.env.PORT || 5000;

const app = express();

//Middleware

app.use(cors());
app.use(bodyParser.json());

//Connect to MongoDB Database

connectDB();

// Use authentication routes
app.use("/api/auth", authRoutes);

//Use post Routes

app.use("/api/posts", postRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
