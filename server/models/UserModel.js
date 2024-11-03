import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please Enter Your Name"] },
    email: { type: String, required: [true, "Please Enter Your Email"], unique: true },
    password: { type: String, required: [true, "Please Enter Your Password"] },
    avatar: { type: String, default: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/sus-la-gi-1.jpg" },
    sfa: { type: Boolean, default: false },
    key: { type: String, default: null },
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel; 
