import express from 'express';
import registerUser from '../Controllers/RegisterUser.js';
import CheckEmail from '../Controllers/CheckEmail.js';
const AuthRouter = express.Router();

// Register a new user
AuthRouter.post('/register', registerUser);
//Check Email User
AuthRouter.post('/check-email', CheckEmail);

// Export the router properly
export default AuthRouter;
