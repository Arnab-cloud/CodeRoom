import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> }
) {
	const { userId } = await params;
	const { searchParams } = new URL(request.url);
	const isArchived = searchParams.get("ia") === "0" ? false : true;
	// console.group(isArchived);
	// console.log("isArchived", isArchived);

	try {
		await dbConnect();

		const user = await UserModel.findOne({ _id: userId });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 401 }
			);
		}

		const classDetails = await UserModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the user by ID
			{ $unwind: "$classes" }, // Unwind the 'classes' array
			{
				$lookup: {
					from: "classes", // Lookup the 'classes' collection
					localField: "classes.classId",
					foreignField: "_id",
					as: "classDetails",
				},
			},
			{ $unwind: "$classDetails" }, // Unwind the resulting 'classDetails' array
			{ $match: { "classDetails.isArchived": isArchived } }, // Match the archived status
			{ $sort: { "classDetails.createdAt": -1 } }, // Sort by creation date
			{
				$lookup: {
					from: "users", // Lookup the 'users' collection
					localField: "classDetails.teachers",
					foreignField: "_id",
					as: "teacherDetails", // Join teacher details
				},
			},
			{
				$project: {
					_id: 0,
					classId: { $toString: "$classes.classId" },
					role: "$classes.role",
					className: "$classDetails.className",
					subject: "$classDetails.subject",
					section: "$classDetails.section",
					teachers: {
						$map: {
							input: "$teacherDetails", // Map through 'teacherDetails' array
							as: "teacher",
							in: {
								fullName: {
									$concat: [
										"$$teacher.firstName",
										" ",
										"$$teacher.lastName",
									],
								}, // Combine first and last names
								email: "$$teacher.email", // Include email if needed
							},
						},
					},
				},
			},
		]);

		// console.log(classDetails);

		return Response.json(
			{
				success: true,
				message: "classes acquired",
				classes: classDetails,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error getting classes", error);
		return Response.json(
			{
				success: false,
				message: "Error getting classes",
			},
			{ status: 500 }
		);
	}
}
