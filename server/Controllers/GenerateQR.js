import qrcode from 'qrcode';
import CheckUserDetailWithToken from '../helpers/CheckUserDetailWithToken.js';

async function generateQR(req, res) {
    try {
        // Lấy token từ cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: 'Authentication token is missing', error: true });
        }

        // Kiểm tra thông tin người dùng từ token
        const user = await CheckUserDetailWithToken(token);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        // Lấy URL của QR code (URL OTP Authenticator)
        const otpauthUrl = user.qrCodeUrl;
        if (!otpauthUrl) {
            return res.status(400).json({ msg: 'QR code URL is not available for this user', error: true });
        }

        // Kiểm tra nếu URL không hợp lệ
        const encodedUrl = encodeURIComponent(otpauthUrl);
        if (!encodedUrl) {
            return res.status(400).json({ msg: 'Invalid QR code URL', error: true });
        }

        // Tạo QR code từ URL
        const qrCodeUrl = await qrcode.toDataURL(encodedUrl);

        // Trả về kết quả QR code dưới dạng base64 data URL
        return res.status(200).json({ qrCodeUrl });

    } catch (err) {
        // In ra lỗi trên server để debug
        console.error('Error generating QR code:', err);

        // Trả về lỗi nếu có lỗi trong quá trình tạo QR code
        return res.status(500).json({ msg: err.message || 'Unexpected error occurred while generating QR code', error: true });
    }
}

export default generateQR;
