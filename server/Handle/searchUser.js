import UserModel from "../models/UserModel.js";

export const searchUser = async (req, res) => {
    const { email } = req.query;

    // Basic email validation
    if (!email) {
        return res.status(400).json({ message: "Invalid or missing email address" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's information (name, email, avatar)
        res.json({ name: user.name, email: user.email, avatar: user.avatar });
    } catch (error) {
        // Log the error for debugging
        console.error('Error in searchUser:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default searchUser;
