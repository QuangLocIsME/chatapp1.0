import express from 'express';
import registerUser from '../Controllers/RegisterUser.js'; // Make sure to include the correct import

const AuthRouter = express.Router();

// Use AuthRouter instead of router
AuthRouter.post('/register', registerUser); // This should reference the function

// Export the router properly
export default AuthRouter;
