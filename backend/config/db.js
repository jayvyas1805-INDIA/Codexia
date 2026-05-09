import mongoose from 'mongoose';
// import Report from '../models/Report.js';
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED !!!");
    } catch (error) {
        console.log("ERROR->", error);
        process.exit(1);
    }
}

export default connectDB;