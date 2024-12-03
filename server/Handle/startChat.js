import UserModel from "../models/UserModel.js";
import Messages from "../models/Messages.js";
import CheckUserDetailWithToken from "../helpers/CheckUserDetailWithToken.js";

const startChat = async (req, res) => {
    const { email } = req.body;
    const token = req.cookies.token;

    try {
        // Kiểm tra xem email có được gửi trong body request không
        if (!email) {
            return res.status(400).json({ message: "Invalid or missing Email" });
        }

        // Lấy thông tin người dùng hiện tại từ token
        const user = await CheckUserDetailWithToken(token);

        // Kiểm tra nếu người dùng cố gắng bắt đầu trò chuyện với chính mình
        if (user.email === email) {
            return res.status(400).json({ message: "You cannot start a chat with yourself" });
        }

        // Kiểm tra xem người nhận có tồn tại trong hệ thống không
        const recipient = await UserModel.findOne({ email });

        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Kiểm tra xem đã có cuộc trò chuyện giữa người dùng và người nhận chưa
        const existingChat = await Messages.findOne({
            $or: [
                { sender: user._id, recipient: recipient._id },
                { sender: recipient._id, recipient: user._id }
            ]
        });

        // Nếu cuộc trò chuyện đã tồn tại, trả về cuộc trò chuyện hiện tại
        if (existingChat) {
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
        }

        const newMessage = new Messages({
            sender: user._id,
            recipient: recipient._id,
            messageType: "text",
            content: "Hi! Let's start a conversation.",
            timestamp: new Date()
        });

        await newMessage.save();

        return res.status(200).json({ message: "Chat started", chat: newMessage });

    } catch (err) {
        console.error("Error starting chat:", err);
        return res.status(500).json({ message: "Something went wrong while starting the chat", error: err.message });
    }
};

export default startChat;
