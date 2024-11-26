import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

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

        return res.status(200).json({ success: true, message: "Login successful" });
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