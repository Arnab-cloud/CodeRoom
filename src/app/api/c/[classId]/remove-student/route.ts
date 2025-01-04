import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ classId: string }> }
) {
	const { studentEmail, userEmail } = await request.json();
	const { classId } = await params;
	if (!classId || !studentEmail || !userEmail) {
		return Response.json(
			{
				success: false,
				message: "Invalid request",
			},
			{ status: 400 }
		);
	}
	console.log(studentEmail, userEmail);

	try {
		await dbConnect();

		const user = await UserModel.findOne({
			email: userEmail,
			classes: { $elemMatch: { classId, role: "teacher" } },
		});

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "unauthorized",
				},
				{ status: 401 }
			);
		}

		const studentToBeDeleted = await UserModel.findOneAndUpdate(
			{
				email: studentEmail,
				classes: { $elemMatch: { classId, role: "student" } },
			},
			{ $pull: { classes: { classId } } }
		);
		// console.log(studentToBeDeleted);
		if (!studentToBeDeleted) {
			return Response.json(
				{
					success: false,
					message: "Student not found",
				},
				{ status: 400 }
			);
		}

		const resultClass = await ClassModel.findOneAndUpdate(
			{ _id: classId },
			{ $pull: { students: studentToBeDeleted._id } }
		);

		if (!resultClass) {
			return Response.json(
				{
					success: false,
					message: "Error updaing class",
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "student deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error in student deletion");
		return Response.json(
			{
				success: false,
				message: "Error student deletion",
			},
			{ status: 500 }
		);
	}
}
