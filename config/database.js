import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const stringUrl ="mongodb+srv://HaiNguyenDu:Nguyenduyhai2004@demo.nbwwo.mongodb.net/BotTelegram?retryWrites=true&w=majority&appName=Demo"
console.log(stringUrl)

const connectDb = async ()=> {
    try {
        await mongoose.connect(stringUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDb;