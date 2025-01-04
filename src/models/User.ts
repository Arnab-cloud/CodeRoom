import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface ClassType {
	classId: ObjectId;
	role: string;
}

export interface User extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	classes: ClassType[];
}

const ClassTypeSchema = new Schema<ClassType>({
	classId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	role: {
		type: String,
		enum: ["teacher", "student"],
		required: true,
	},
});

const UserSchema: Schema<User> = new Schema({
	firstName: {
		type: String,
		required: [true, "first name is required"],
	},
	lastName: {
		type: String,
		required: [true, "last name is required"],
	},
	password: {
		type: String,
		required: [true, "password is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "email is required"],
		unique: true,
		trim: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Please use a valid email",
		],
	},
	classes: {
		type: [ClassTypeSchema],
		required: true,
		default: [],
	},
});

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model("User", UserSchema);

export default UserModel;
