import "dotenv/config";
import cors from "cors" ;


import express from "express";
import mongoose from "mongoose";
import userRouter from "./ROUTES/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./ROUTES/productRouter.js";
import dotenv from "dotenv";

dotenv.config()
const app = express(); 
app.use (cors())

// middleware to parse incoming JSON requests
app.use(express.json());

app.use((req, res, next) => {
    const authorization = req.header("Authorization");

    if (!authorization) {
        return next();
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded == null) {
            return res.status(401).json({
                message: "Invalid Token Please Login Again"
            });
        }

        req.user = decoded;
        return next();
    });
});


mongoose.connect(process.env.MONGO_URI).then(
    () => {
        console.log("Database Connected Successfully");
    }
).catch(
    (err)=>{
        console.log("Database Connection Failed");
        console.error("Reason:", err.message);
    }
)

app.use("/api/users", userRouter);
app.use("/api/products",productRouter);







/*
function success() {
    console.log("Server is running on port 5000");
}*/
app.listen(5000,
() => {
    console.log("Server is running on port 5000");
      }
    
);

 