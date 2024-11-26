import UserModel from '../models/UserModel.js';
import CheckUserDetailWithToken from '../helpers/CheckUserDetailWithToken.js';

async function disable2FA(req, res) {
    try {
        // Lấy token từ cookies
        const token = req.cookies.token;

        // Xác thực và lấy thông tin người dùng
        const user = await CheckUserDetailWithToken(token);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        // Kiểm tra nếu người dùng đã bật 2FA
        if (!user.key) {
            return res.status(400).json({ msg: '2FA is not enabled for this user', error: true });
        }

        // Xóa key TOTP trong cơ sở dữ liệu để vô hiệu hóa 2FA
        user.key = null;
        user.sfa = false; // Nếu bạn lưu trạng thái SFA (2FA) trong trường `sfa`
        await user.save();

        // Trả về thông báo thành công
        return res.status(200).json({
            msg: '2FA has been successfully disabled',
            success: true,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message || 'Unexpected error occurred', error: true });
    }
}

export default disable2FA;
