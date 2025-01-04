import mongoose, { Document, ObjectId, Schema } from "mongoose";
export interface Class extends Document {
	className: string;
	subject: string;
	section: string;
	isArchived: boolean;
	teachers: ObjectId[];
	students: ObjectId[];
	joiningCode: string;
	createdAt: Date;
}

const ClassSchema: Schema<Class> = new Schema({
	className: {
		type: String,
		required: [true, "Class name is required"],
		trim: true,
	},
	subject: {
		type: String,
		required: [true, "subject is required"],
		trim: true,
	},
	section: {
		type: String,
		trim: true,
	},
	isArchived: {
		type: Boolean,
		required: true,
		default: false,
	},
	teachers: {
		type: [Schema.Types.ObjectId],
		ref: "User",
		required: true,
	},
	students: {
		ref: "User",
		type: [Schema.Types.ObjectId],
		required: true,
		default: [],
	},
	joiningCode: {
		type: String,
		unique: true,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const ClassModel =
	(mongoose.models.Class as mongoose.Model<Class>) ||
	mongoose.model("Class", ClassSchema);
export default ClassModel;
