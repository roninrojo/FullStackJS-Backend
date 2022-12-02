import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const db = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`🌱 MongoDB connected in ${url}`);

    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

export default connectDB;