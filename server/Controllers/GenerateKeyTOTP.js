import { Totp } from 'time2fa';
import UserModel from '../models/UserModel.js';
import CheckUserDetailWithToken from '../helpers/CheckUserDetailWithToken.js';
import * as qrcode from "qrcode";

async function generateKey(req, res) {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // Verify and authenticate user
        const user = await CheckUserDetailWithToken(token);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        // Generate TOTP key for the user
        const key = Totp.generateKey({
            issuer: 'BuzzChat',
            user: user.email,
        });


        // Save secret key to the database
        user.sfa = true;
        user.key = key.secret;
        await user.save();

        // Generate QR code for the user to scan
        const qrCodeUrl = await qrcode.toDataURL(key.url);
        user.qrCodeUrl = qrCodeUrl;
        await user.save();

        // Return QR code and secret key
        return res.status(200).json({
            msg: 'Key generated successfully',
            data: { qrCodeUrl, secret: key.secret },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message || 'Unexpected error occurred', error: true });
    }
}

export default generateKey;