import express from "express";
import { searchUser } from "../Handle/searchUser.js";
import authenticateToken from '../Middleware/authenticateToken.js';
import startChat from '../Handle/startChat.js';
import getConversation from "../helpers/Getconversation.js";
import getAllMessage from "../helpers/getallchat.js";

const handleRounter = express.Router();

handleRounter.get("/search", authenticateToken, searchUser);
handleRounter.post("/chat", authenticateToken, startChat);
handleRounter.get("/message", authenticateToken, getConversation)
handleRounter.get("/allmessage", authenticateToken, getAllMessage)
export default handleRounter;

