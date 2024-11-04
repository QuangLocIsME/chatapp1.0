import UserModel from '../models/UserModel.js';

async function UpdateUserDetail(req, res) {
    try {
        // Lấy thông tin người dùng từ token đã được middleware giải mã
        const { name, avatar } = req.body;

        // Cập nhật thông tin người dùng
        const updateUser = await UserModel.updateOne({ _id: req.user.id }, { name, avatar });

        // Lấy thông tin mới nhất của người dùng để trả về
        const userInformation = await UserModel.findById(req.user.id);

        return res.status(200).json({ msg: "Đã cập nhập thành công", success: true, data: userInformation });
    } catch (err) {
        console.log("Lỗi trong quá trình cập nhập", err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default UpdateUserDetail;
