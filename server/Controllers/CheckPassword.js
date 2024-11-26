import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        // Check for missing inputs
        if (!password || !userId) {
            return res.status(400).json({ success: false, message: "Missing required fields: password or userId" });
        }

        // Find user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify password
        if (!user.password) {
            return res.status(400).json({ success: false, message: "User password not set" });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        if (!user.sfa) {
            // Generate the token
            const tokenData = {
                id: user._id,
                email: user.email,
            };
            const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600000,
            });

            return res.status(200).json({ success: true, message: "Login successful", token });
        }

        return res.status(200).json({ success: true, message: "Password verified, proceed to OTP" });
    } catch (error) {
        console.error("Error during password check:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during password verification",
            error: error.message,
        });
    }
}

export default checkPassword;