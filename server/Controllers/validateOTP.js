import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { Totp } from "time2fa";

async function validateOTP(req, res) {
    try {
        const { otp, userId } = req.body;

        // Check for missing inputs
        if (!otp || !userId) {
            return res.status(400).json({ msg: "Missing required fields: otp or userId", error: true });
        }

        // Find user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found", error: true });
        }

        // Validate OTP
        const isValid = Totp.validate({ passcode: otp, secret: user.key });

        if (isValid) {
            const tokenData = {
                id: user._id,
                email: user.email,
            };

            // Generate the token
            const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600000,
            });

            return res.status(200).json({ msg: "OTP validated successfully", error: false });
        } else {
            return res.status(400).json({ msg: "Invalid OTP", error: true });
        }

    } catch (err) {
        console.error("Error during OTP validation:", err);
        return res.status(500).json({ msg: "An error occurred. Please try again later.", error: true });
    }
}

export default validateOTP;