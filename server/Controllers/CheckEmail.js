import UserModel from "../models/UserModel.js";

async function CheckEmail(req, res) {
    try {
        const { email } = req.body;
        const checkEmail = await UserModel.findOne({ email }).select("-password");

        if (!checkEmail) {
            return res.status(400).json({ msg: "Email not found" });
        }

        return res.status(200).json({ msg: "Email found", success: true, data: checkEmail });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default CheckEmail;
