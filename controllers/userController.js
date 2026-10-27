import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
    try {
        const { email, firstName, lastName, password, Role, isEmailVerified, ProfileImage } = req.body;

        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isAdministrator = isAdmin(req);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            Role: isAdministrator && typeof Role === "string" ? Role : "user",
            isEmailVerified: isAdministrator && typeof isEmailVerified === "boolean" ? isEmailVerified : false,
            ProfileImage
        });

        await user.save();
        return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Failed to Create User" });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.Role || user.role,
                isEmailVerified: user.isEmailVerified ?? user.isemailVerified
            },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Failed to log in" });
    }
}



export function isAdmin(req){
       if (req.user== null){
        return false;
       }
       if (req.user.role !== "admin"){
        return false;
       }  
       
       return true;
}
