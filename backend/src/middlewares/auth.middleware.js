import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        // 1. Get the token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            console.log("❌ Auth Failed: No token provided");
            return res.status(401).json({ message: "Unauthorized request" });
        }

        // 2. Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // DEBUGGING: See exactly what is inside the token
        console.log("🕵️ MIDDLEWARE DECODED TOKEN:", decodedToken);

        // 3. Find the user (Handle both _id and id cases)
        const userId = decodedToken._id || decodedToken.id;

        if(!userId) {
             console.log("❌ Auth Failed: Token has no ID field");
             return res.status(401).json({ message: "Invalid Token Structure" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            console.log("❌ Auth Failed: User ID from token not found in DB:", userId);
            return res.status(401).json({ message: "User not found" });
        }

        // 4. Success
        req.user = user;
        next();

    } catch (error) {
        console.log("❌ Auth Middleware Error:", error.message);
        return res.status(401).json({ message: error?.message || "Invalid Access Token" });
    }
};

export default authMiddleware;
