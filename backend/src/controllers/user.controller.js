import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async(req,res) => {
    try {
        const {username,email,password} = req.body
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

const existing = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if(existing){
            return res.status(400).json({message: "User with this email or username already exists"})
        }
        const user = await User.create({
            username,
            email,
            password
        });

        return res.status(201).json({message: "User registered successfully",
            user: {id: user._id, username: user.username ,email: user.email}
        })
    } catch (error) {
            console.error("REGISTER ERROR", error);
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "username or email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }
        
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );
        
        return res.status(200).json({
            message: "User logged in",
            token: accessToken,
            user
        });

    } catch (error) {
        // Log the ACTUAL error
        console.error("🔥 CRITICAL LOGIN ERROR:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const logoutUser = async (req,res) => {
    try {
    res.status(200).json({
        message:"Logged out successfully"
    });
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",error
        });
    }
}
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export{
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};
