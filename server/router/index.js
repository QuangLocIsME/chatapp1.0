import express from 'express';
import registerUser from '../Controllers/RegisterUser.js';
import CheckEmail from '../Controllers/CheckEmail.js';
import CheckPassword from '../Controllers/CheckPassword.js';
import CheckUserDetail from '../Controllers/UserDetail.js';
import Logout from '../Controllers/Logout.js';
import authenticateToken from '../Middleware/authenticateToken.js';

const AuthRouter = express.Router();

// Register a new user
AuthRouter.post('/register', registerUser);
//Check Email User
AuthRouter.post('/check-email', CheckEmail);
//check password user
AuthRouter.post('/check-password', CheckPassword);
//Check User Detail With Token 
AuthRouter.get('/check-user', authenticateToken, CheckUserDetail);
//Logout User
AuthRouter.get('/logout', authenticateToken, Logout);

// Export the router properly
export default AuthRouter;
