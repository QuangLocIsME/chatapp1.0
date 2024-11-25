import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import multer from 'multer';
import path from 'path';
import UserModel from '../models/UserModel.js';
const upload = multer({ dest: 'uploads/' });

async function uploadImageToDiscord(req, res) {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(file.path);

    try {
        // Prepare the form data to send to Discord
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Send the file to the specified Discord channel
        const response = await axios.post(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
            formData,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                    ...formData.getHeaders(),
                },
            }
        );

        // Extract the file URL from Discord's response
        const imageUrl = response.data.attachments[0]?.url;

        // Clean up the local file after successful upload
        fs.unlinkSync(filePath);

        // Update the user's avatar URL in the database
        const userId = req.user.id;
        await UserModel.findByIdAndUpdate(userId, { avatar: imageUrl });

        return res.json({ success: true, url: imageUrl });
    } catch (error) {
        console.error('Error uploading image to Discord:', error);

        // Ensure file cleanup even if an error occurs
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(500).json({ success: false, error: 'Failed to upload image to Discord' });
    }
}

export { upload, uploadImageToDiscord };