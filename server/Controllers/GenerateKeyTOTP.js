import { Totp } from 'time2fa';
import UserModel from '../models/UserModel.js';
import CheckUserDetailWithToken from '../helpers/CheckUserDetailWithToken.js';
import qrcode from 'qrcode';

async function generateKey(req, res) {
    try {
        // Lấy token từ cookies
        const token = req.cookies.token;

        // Kiểm tra và xác thực người dùng
        const user = await CheckUserDetailWithToken(token);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        // Tạo TOTP key cho người dùng
        const key = Totp.generateKey({
            issuer: 'BuzzChat',
            user: user.email,
        });

        // Lưu secret key vào cơ sở dữ liệu
        user.sfa = true;
        user.key = key.secret;
        await user.save();

        // Tạo QR code cho người dùng quét
        const qrCodeUrl = await qrcode.toDataURL(key.url);

        // Trả về QR code và secret key
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
