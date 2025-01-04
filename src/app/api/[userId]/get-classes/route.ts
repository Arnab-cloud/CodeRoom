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
			{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
			{ $unwind: "$classes" },
			{
				$lookup: {
					from: "classes",
					localField: "classes.classId",
					foreignField: "_id",
					as: "classDetails",
				},
			},
			{ $unwind: "$classDetails" },
			{ $match: { "classDetails.isArchived": isArchived } },
			{ $sort: { "classDetails.createdAt": -1 } },
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
							input: "$classDetails.teachers",
							as: "teacher",
							in: { $toString: "$$teacher" },
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
