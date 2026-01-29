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

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        })
        if(!user){
            return res.status(400).json({message: "User not found"})
        };
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"});
        
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })   
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

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