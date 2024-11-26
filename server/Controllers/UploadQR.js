import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
import qrcode from 'qrcode';
import { Buffer } from 'buffer';

// Generate the QR code and upload it to Discord
async function sendQRToDiscord(qrCodeData) {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
        throw new Error('Discord bot token or channel ID not set');
    }

    try {
        // Generate QR code from the input data
        const qrCodeUrl = await qrcode.toDataURL(qrCodeData);

        // Extract the base64-encoded data from the QR code URL
        const base64Data = qrCodeUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Create a temporary file path to store the QR code image
        const tempFilePath = path.resolve(__dirname, 'uploads', 'qrcode.png');

        // Ensure the uploads directory exists
        if (!fs.existsSync(path.dirname(tempFilePath))) {
            fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
        }

        // Write the buffer to a file
        fs.writeFileSync(tempFilePath, buffer);

        // Create a FormData object for the file upload
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFilePath));

        // Send the file to Discord using the bot token and channel ID
        const response = await axios.post(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
            formData,
            {
                headers: {
                    'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                    ...formData.getHeaders(),
                },
            }
        );

        // Check if the upload was successful and retrieve the URL
        const qrImageUrl = response.data.attachments[0]?.url;
        if (!qrImageUrl) {
            throw new Error('Failed to retrieve QR image URL from Discord response');
        }

        // Clean up the local file after upload
        fs.unlinkSync(tempFilePath);

        // Log and return the QR image URL
        console.log('QR Code uploaded to Discord:', qrImageUrl);
        return qrImageUrl;
    } catch (error) {
        console.error('Error sending QR to Discord:', error);
        throw new Error('Failed to send QR code to Discord');
    }
}

export default sendQRToDiscord;
