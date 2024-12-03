import Messages from "../models/Messages.js";
import CheckUserDetailWithToken from "../helpers/CheckUserDetailWithToken.js";
import { getIO } from '../config/socket.js';

const sendMessage = async (req, res) => {
    const token = req.cookies.token;
    const { recipientId, content, messageType = "text" } = req.body;

    try {
        const sender = await CheckUserDetailWithToken(token);

        if (!sender) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!content || !recipientId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newMessage = new Messages({
            sender: sender._id,
            recipient: recipientId,
            content,
            messageType,
            timestamp: new Date()
        });

        await newMessage.save();
        await newMessage.populate('sender recipient');

        const io = getIO();
        io.to(recipientId).emit('message received', newMessage);
        io.to(sender._id.toString()).emit('message received', newMessage);

        return res.status(200).json(newMessage);
    } catch (err) {
        console.error("Error sending message:", err);
        return res.status(500).json({ message: "Error sending message" });
    }
};

export default sendMessage;
