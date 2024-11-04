import bcrypt from 'bcryptjs';
const UserModel = require('../models/UserModel.js');
const token = require('jsonwebtoken');

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;

        // Check if the email is already registered
        const user = await UserModel.findbyId(userId);
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }
        const tokenData = {
            id: user._id,
            email: user.email,

        };
        const token = await jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });
        const cookieOption = {
            httpOnly: true,
            secure: true,
        }
        return res.cookie('token', token, cookieOption).status(200).json({ message: "Mật khẩu đúng", token: token, success: true });
    } catch (error) {
        console.error("Error during registration:", error); // Optional: log error for debugging
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" }); // Optional: clearer error message
    }
}
export default checkPassword;