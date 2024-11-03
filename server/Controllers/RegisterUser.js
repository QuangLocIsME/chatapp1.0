import UserModel from "../models/UserModel.js"; // Ensure the .js extension if using ES modules
import bcrypt from "bcrypt";

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const checkMail = await UserModel.findOne({ email });
        if (checkMail) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in the database
        const user = await UserModel.create({ name, email, password: hashedPassword });

        console.log("Đăng Ký Thành Công:", name);
        res.status(201).json({ user });
    } catch (error) {
        console.error("Error during registration:", error); // Optional: log error for debugging
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" }); // Optional: clearer error message
    }
}

export default registerUser;
