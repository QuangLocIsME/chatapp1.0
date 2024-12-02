import express from "express";
import { searchUser } from "../Handle/searchUser.js";
import authenticateToken from '../Middleware/authenticateToken.js';
const handleRounter = express.Router();

handleRounter.get("/search", authenticateToken, searchUser);

export default handleRounter;

