import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
	const { email, joiningCode } = await request.json();

	if (!joiningCode) {
		return Response.json(
			{
				success: true,
				message: "Enter joining code",
			},
			{ status: 304 }
		);
	}

	try {
		await dbConnect();

		const resultClass = await ClassModel.findOne({
			joiningCode: joiningCode,
		});
		if (!resultClass) {
			return Response.json(
				{ success: false, message: "Invalid joining code" },
				{ status: 304 }
			);
		}

		const classId = resultClass._id as mongoose.Schema.Types.ObjectId;
		const user = await UserModel.findOne({ email });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "Unauthorized",
				},
				{ status: 400 }
			);
		}

		const userAdded = user.classes.some(
			(classItem) => classItem.classId.toString() === classId.toString()
		);

		if (userAdded) {
			return Response.json(
				{
					success: false,
					message: "Aready added",
					classId: classId.toString(),
				},
				{ status: 304 }
			);
		}

		user.classes.push({ classId, role: "student" });
		resultClass.students.push(user._id as mongoose.Schema.Types.ObjectId);
		await user.save();
		await resultClass.save();

		return Response.json(
			{
				success: true,
				message: "User added to the class",
				classId: classId.toString(),
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error joining class", error);
		return Response.json({
			success: false,
			message: "Error joining class",
		});
	}
}
