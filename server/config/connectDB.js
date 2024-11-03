import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/chatapp", {

        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

export default connectDB; 
