import { Totp } from 'time2fa';
import UserModel from '../models/UserModel.js';
import CheckUserDetailWithToken from '../helpers/CheckUserDetailWithToken.js';

async function validateOTP(req, res) {
    try {
        const { otp } = req.body;  // Mã OTP người dùng nhập vào
        const token = req.cookies.token;

        const user = await CheckUserDetailWithToken(token);

        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        if (!user.key) {
            return res.status(400).json({ msg: '2FA is not enabled for this account', error: true });
        }

        // Validate OTP using TOTP
        const isValid = Totp.validate({
            passcode: otp,      // OTP do người dùng nhập
            secret: user.key    // Secret key của người dùng từ cơ sở dữ liệu
        });

        if (isValid) {
            return res.status(200).json({ msg: 'OTP is valid', success: true });
        } else {
            return res.status(400).json({ msg: 'Invalid OTP', error: true });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default validateOTP;
