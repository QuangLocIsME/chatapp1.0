import express from 'express';
import UpdateUserDetail from '../Controllers/UpdateUserDetail.js';
import authenticateToken from '../Middleware/authenticateToken.js';
import { upload, uploadImageToDiscord } from '../Controllers/UploadAvatar.js';

const ProfileRouter = express.Router();

//Update User Detail Router
ProfileRouter.post('/update', authenticateToken, UpdateUserDetail);
//Export the router
ProfileRouter.post('/upload-avatar', upload.single('avatar'), authenticateToken, uploadImageToDiscord);
export default ProfileRouter;