import UserModel from "../models/UserModel.js";

export const searchUser = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Invalid or missing email address" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ name: user.name, email: user.email, avatar: user.avatar });
    } catch (error) {
        console.error('Error in searchUser:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default searchUser;
