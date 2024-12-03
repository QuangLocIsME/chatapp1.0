import UserModel from "../models/UserModel.js";
import Messages from "../models/Messages.js";
import CheckUserDetailWithToken from "../helpers/CheckUserDetailWithToken.js";

const getAllMessage = async (req, res) => {
    const token = req.cookies.token;
    const user = await CheckUserDetailWithToken(token);

    try {
        const messages = await Messages.find({
            $or: [
                { sender: user._id },
                { recipient: user._id },
            ],
        })
            .sort({ timestamp: -1 })
            .populate('sender recipient');

        const conversations = {};

        messages.forEach((message) => {
            const partnerId = message.sender._id.toString() === user._id.toString()
                ? message.recipient._id.toString()
                : message.sender._id.toString();

            if (!conversations[partnerId]) {
                const partnerInfo = message.sender._id.toString() === user._id.toString()
                    ? {
                        _id: message.recipient._id,
                        name: message.recipient.name,
                        email: message.recipient.email,
                        avatar: message.recipient.avatar
                    }
                    : {
                        _id: message.sender._id,
                        name: message.sender.name,
                        email: message.sender.email,
                        avatar: message.sender.avatar
                    };

                conversations[partnerId] = {
                    partner: partnerInfo,
                    lastMessage: message.content,
                    lastMessageTimestamp: message.timestamp,
                    avatar: message.sender._id.toString() === user._id.toString() ? message.recipient.avatar : message.sender.avatar
                };
            }
        });

        // Transform the conversations object into an array of conversation data
        const conversationList = Object.values(conversations).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

        return res.status(200).json(conversationList); // Send the conversation list as response
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching conversation" });
    }
};

export default getAllMessage;
