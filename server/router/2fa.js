import express from 'express';
import generateKey from '../Controllers/GenerateKeyTOTP.js'; // Ensure the correct path and file extension
import validateOTP from '../Controllers/validateOTP.js'; // Ensure the correct path and file extension
import disable2FA from '../Controllers/Disable2fa.js'; // Ensure the correct path and file extension
import authenticateToken from '../Middleware/authenticateToken.js'; // Ensure the correct path and file extension
import sendQRToDiscord from '../Controllers/UploadQR.js'; // Ensure the correct path and file extension
const sfarouter = express.Router();

sfarouter.post('/generate-key', authenticateToken, generateKey);
sfarouter.post('/disable-2fa', authenticateToken, disable2FA);
sfarouter.post('/validate-otp', validateOTP);
sfarouter.post('/generate-qr', authenticateToken, sendQRToDiscord);

export default sfarouter;