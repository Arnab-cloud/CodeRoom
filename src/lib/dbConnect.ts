import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async () => {
	if (connection.isConnected) {
		console.log("Already connected to db");
		return;
	}

	const mongo_uri = process.env.MONGO_URI + "CodeRoom";

	try {
		const db = await mongoose.connect(mongo_uri);
		connection.isConnected = db.connections[0].readyState;

		console.log("Db connected successfully");
	} catch (error) {
		console.log("Database connection failed", error);
		process.exit(1);
	}
};

export default dbConnect;
