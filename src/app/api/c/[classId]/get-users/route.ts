import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ classId: string }> }
) {
	const { classId } = await params;
	// const { userEmail } = await request.json();
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("ue");
	if (!email) {
		return Response.json(
			{
				success: false,
				message: "email to specified",
			},
			{ status: 400 }
		);
	}

	try {
		await dbConnect();
		const user = await UserModel.findOne({
			email,
			classes: { $elemMatch: { classId } },
		});
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "user not in class",
				},
				{ status: 401 }
			);
		}

		const result = await ClassModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(classId) } },
			{
				$project: {
					teachers: {
						$map: {
							input: "$teachers",
							as: "teacher",
							in: {
								userId: "$$teacher",
								role: "teacher",
							},
						},
					},
					students: {
						$map: {
							input: "$students",
							as: "student",
							in: {
								userId: "$$student",
								role: "student",
							},
						},
					},
				},
			},
			{
				$project: {
					userList: { $concatArrays: ["$teachers", "$students"] },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "userList.userId",
					foreignField: "_id",
					as: "resultUsers",
				},
			},
			{
				$project: {
					_id: 0,
					users: {
						$map: {
							input: { $range: [0, { $size: "$userList" }] },
							as: "idx",
							in: {
								$mergeObjects: [
									{ $arrayElemAt: ["$userList", "$$idx"] },
									{ $arrayElemAt: ["$resultUsers", "$$idx"] },
								],
							},
						},
					},
				},
			},
		]);

		const users = result.length > 0 ? result[0].users : [];
		const reducesUsers = users.map((user: any) => ({
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			email: user.email,
		}));
		// console.log(reducesUsers);

		return Response.json(
			{
				success: true,
				message: "users found",
				users: reducesUsers,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error getting users", error);
		return Response.json(
			{
				success: false,
				message: "Error getting users",
			},
			{ status: 500 }
		);
	}
}
