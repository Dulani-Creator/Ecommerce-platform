import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        Role: {
            type: String,
            required: true,
            default: "user"
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        ProfileImage: {
            type: String,
            default: "https://share.google/KCANriyQCpI88iUk2"
        }
    }
);

const User = mongoose.model("User", userSchema);
export default User;