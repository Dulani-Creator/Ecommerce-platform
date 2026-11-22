import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "jwtSecretKey";

export async function createUser(req, res) {
    try {
        const { email, firstName, lastName, password, Role, isEmailVerified, ProfileImage } = req.body;

        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const isAdministrator = isAdmin(req);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            email: normalizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: hashedPassword,
            Role: isAdministrator && typeof Role === "string" ? Role : "user",
            isEmailVerified: isAdministrator && typeof isEmailVerified === "boolean" ? isEmailVerified : false,
            ProfileImage: ProfileImage || "https://share.google/KCANriyQCpI88iUk2"
        });

        await user.save();
        return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email is already registered" });
        }
        return res.status(500).json({ message: "Failed to Create User" });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const storedRole = user.role ?? user.Role;
        const role = typeof storedRole === "string" ? storedRole.trim().toLowerCase() : "user";
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role,
                isEmailVerified: user.isEmailVerified ?? false
            },
            jwtSecret
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role,
                isEmailVerified: user.isEmailVerified ?? false
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Failed to log in" });
    }
}

export function isAdmin(req) {
    if (!req.user) {
        return false;
    }
    const role = (req.user.role || req.user.Role || "").toString().trim().toLowerCase();
    return role === "admin";
}

export function isCustomer(req) {
    if (!req.user) {
        return false;
    }
    const role = (req.user.role || req.user.Role || "").toString().trim().toLowerCase();
    return role === "user" || role === "customer";
}
