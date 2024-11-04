import express from 'express';
import UpdateUserDetail from '../Controllers/UpdateUserDetail.js';
import authenticateToken from '../Middleware/authenticateToken.js';
const ProfileRouter = express.Router();

//Update User Detail Router
ProfileRouter.post('/update', authenticateToken, UpdateUserDetail);
//Export the router
export default ProfileRouter;