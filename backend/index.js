import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import userRouter from "./ROUTES/userRouter.js";
import productRouter from "./ROUTES/productRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "jwtSecretKey";

app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT token if provided
app.use((req, res, next) => {
    const authorization = req.header("Authorization");

    if (!authorization) {
        return next();
    }

    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded == null) {
            return res.status(401).json({
                message: "Invalid Token Please Login Again"
            });
        }

        req.user = decoded;
        return next();
    });
});

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Skyreck / AURA Backend API is running." });
});

// Routes: support both with /api and without /api prefixes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

// Database connection and server startup
async function startServer() {
    if (!process.env.MONGO_URI) {
        console.warn("Warning: MONGO_URI is not set in environment.");
        return;
    }

    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database Connection Failed");
        console.error("Reason:", err.message);
    }
}

startServer();
