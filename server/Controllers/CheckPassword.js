import UserModel from "../models/UserModel.js"; // Ensure the .js extension if using ES modules
import bcrypt from "bcrypt";
import jsonwebtoken from 'jsonwebtoken'; // Correct import name

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
        const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });
        const cookieOption = {
            httpOnly: true,
            secure: true,
        };

        // Send the response with the token as a cookie
        return res.cookie('token', token, cookieOption).status(200).json({ message: "Mật khẩu đúng", token: token, success: true });
    } catch (error) {
        console.error("Error during password check:", error); // Improved error log for clarity
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình kiểm tra mật khẩu" }); // Clarified error message
    }
}

export default checkPassword;
