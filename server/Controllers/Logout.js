async function Logout(req, res) {
    try {
        const cookieOption = {
            httpOnly: true,
            secure: true,
        };
        return res.cookie('token', '', cookieOption).status(200).json({
            message: "Đăng Xuất Thành Công",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}
export default Logout;