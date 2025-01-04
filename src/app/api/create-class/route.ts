import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
	// first extract the info from the request body
	try {
		const { className, subject, section, teacherEmail } =
			await request.json();
		await dbConnect();

		// First get the teacher
		const teacher = await UserModel.findOne({ email: teacherEmail });
		if (!teacher) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 401 }
			);
		}

		const joiningCode = nanoid(10);
		// console.log("join code", joiningCode);
		// const session = await ClassModel.startSession();
		// session.startTransaction();

		const newClass = new ClassModel({
			className,
			subject,
			section,
			isArchived: false,
			teachers: [teacher._id],
			students: [],
			joiningCode,
		});

		teacher.classes.push({
			classId: newClass._id as mongoose.Schema.Types.ObjectId,
			role: "teacher",
		});
		await newClass.save();

		await teacher.save();
		// console.log(result)

		return Response.json(
			{
				success: true,
				message: "Ok",
				classId: newClass._id,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "error",
			},
			{ status: 500 }
		);
	}
}
