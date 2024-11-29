import UserModel from '../models/UserModel.js';
import getUserDetailsFromToken from '../helpers/CheckUserDetailWithToken.js';
import bcrypt from 'bcrypt';

async function updatePassword(req, res) {
    try {
        const token = req.cookies.token;
        const user = await getUserDetailsFromToken(token);
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ msg: "Nhập đủ thông tin", error: true });
        }

        // Check password length
        if (password.length <= 6) {
            return res.status(400).json({ msg: "Password must be longer than 6 characters", error: true });
        }

        const userInformation = await UserModel.findById(user._id);

        if (!userInformation) {
            return res.status(404).json({ msg: "User not found", error: true });
        }

        // Optional: Check if the new password is different from the current one
        const isSamePassword = await bcrypt.compare(password, userInformation.password);
        if (isSamePassword) {
            return res.status(400).json({ msg: "New password cannot be the same as the old password", error: true });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        userInformation.password = hashedPassword;

        // Save the updated user document
        await userInformation.save();

        return res.status(200).json({
            msg: "Password updated successfully",
            success: true,
            data: userInformation, // Return the updated user data (exclude password if needed)
        });
    } catch (err) {
        console.log("Lỗi trong quá trình cập nhập", err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default updatePassword;
