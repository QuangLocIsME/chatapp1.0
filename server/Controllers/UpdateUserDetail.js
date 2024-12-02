import UserModel from '../models/UserModel.js';
import getUserDetailsFromToken from '../helpers/CheckUserDetailWithToken.js';

async function UpdateUserDetail(req, res) {
    try {
        
        const token = req.cookies.token;
        const user = await getUserDetailsFromToken(token);

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ msg: "Nhập đủ thông tin", error: true });
        }

        
        if (name.length > 6) {
           
            const userInformation = await UserModel.findById(user._id); // Use user._id here

            if (!userInformation) {
                return res.status(404).json({ msg: "User not found", error: true });
            }

       
            userInformation.name = name;

            await userInformation.save();

            return res.status(200).json({
                msg: "Đã cập nhập thành công",
                success: true,
                data: userInformation 
            });
        } else {
            return res.status(400).json({ msg: "Tên phải dài hơn 6 ký tự", error: true });
        }
    } catch (err) {
        console.log("Lỗi trong quá trình cập nhập", err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default UpdateUserDetail;
