import mangoose from "mongoose";

const userSchema = new mangoose.Schema (
    {
        email: {
            type: String,
            required: true,
            unique: true
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
            type:String,
            required:true
        },
        Role :{
            type: String,
            required: true,
            default: 'user'
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isEmailVerified : {
            type: Boolean,
            default: false
        },
        ProfileImage: {
            type: String,
            default: 'https://share.google/KCANriyQCpI88iUk2'
        }



    }
)

const User = mangoose.model("User", userSchema);
export default User;