import UserModel from "../models/UserModel.js";
import Messages from "../models/Messages.js";
import CheckUserDetailWithToken from "../helpers/CheckUserDetailWithToken.js";

const getConversation = async (req, res) => {
    const token = req.cookies.token;
    const user = await CheckUserDetailWithToken(token);

    const { recipientId } = req.query;

    if (!recipientId) {
        return res.status(400).json({ message: "Invalid or missing recipientId" });
    }

    try {
        const messages = await Messages.find({
            $or: [
                { sender: user._id, recipient: recipientId },
                { sender: recipientId, recipient: user._id },
            ],
        })
            .sort({ timestamp: 1 })
            .populate('sender recipient');

        return res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching conversation" });
    }
};

export default getConversation;
