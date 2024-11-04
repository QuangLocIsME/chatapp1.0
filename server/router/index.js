import express from 'express';
import registerUser from '../Controllers/RegisterUser.js';
import CheckEmail from '../Controllers/CheckEmail.js';
import CheckPassword from '../Controllers/CheckPassword.js';
const AuthRouter = express.Router();

// Register a new user
AuthRouter.post('/register', registerUser);
//Check Email User
AuthRouter.post('/check-email', CheckEmail);
//check password user
AuthRouter.post('/check-password', CheckPassword);

// Export the router properly
export default AuthRouter;
