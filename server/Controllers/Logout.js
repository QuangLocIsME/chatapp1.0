async function Logout(req, res) {
    try {
        const cookieOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Protect against CSRF
            expires: new Date(0), // Immediately expire the cookie
        };
        res.cookie('token', '', cookieOption);
        return res.status(200).json({
            message: "Đăng Xuất Thành Công",
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}
export default Logout;
