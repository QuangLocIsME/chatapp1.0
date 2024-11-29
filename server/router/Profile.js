import express from 'express';
import UpdateUserDetail from '../Controllers/UpdateUserDetail.js';
import authenticateToken from '../Middleware/authenticateToken.js';
import { upload, uploadImageToDiscord } from '../Controllers/UploadAvatar.js';
import updatePassword from '../Controllers/Updatepassword.js';
const ProfileRouter = express.Router();

//Update User Detail Router
ProfileRouter.post('/update', authenticateToken, UpdateUserDetail);
//Update Password Router
ProfileRouter.post('/update-password', authenticateToken, updatePassword);

//Upload Avatar Router
ProfileRouter.post('/upload-avatar', upload.single('avatar'), authenticateToken, uploadImageToDiscord);
export default ProfileRouter;