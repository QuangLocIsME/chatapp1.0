import UserModel from "../models/UserModel.js"; // Ensure the .js extension if using ES modules
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"; // Correct import name

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the password
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }

        // Create token data
        const tokenData = {
            id: user._id,
            email: user.email,
        };

        // Generate the token
        const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure in production
            sameSite: "strict", // Protect against CSRF
            maxAge: 3600000, // 1 hour in milliseconds
        });

        return res.status(200).json({
            message: "Mật khẩu đúng",
            token, // For debugging purposes, remove this in production
            success: true,
        });
    } catch (error) {
        console.error("Error during password check:", error);
        res.status(500).json({
            message: "Đã xảy ra lỗi trong quá trình kiểm tra mật khẩu",
            error: error.message,
        });
    }
}

export default checkPassword;
