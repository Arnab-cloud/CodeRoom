import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";

export async function POST(request: Request) {
	const { teacherEmail, email, role, classId } = await request.json();
	if (role !== "student" && role !== "teacher") {
		return Response.json(
			{ success: false, role: "role not defined" },
			{ status: 401 }
		);
	}

	try {
		await dbConnect();
		const teacher = await UserModel.findOne({
			email: teacherEmail,
			classes: {
				$elemMatch: {
					classId,
					role: "teacher",
				},
			},
		});
		if (!teacher) {
			return Response.json(
				{
					success: false,
					message: "Unauthorized",
				},
				{ status: 401 }
			);
		}
		const user = await UserModel.findOne({ email });
		if (!user || !user.classes) {
			return Response.json(
				{
					success: false,
					message: "User not found Or Classes not found",
				},
				{ status: 404 }
			);
		}

		const exists = user.classes.some(
			(classItem) => classItem.classId.toString() === classId
		);
		if (exists) {
			return Response.json(
				{
					success: false,
					message: "User already added",
				},
				{ status: 401 }
			);
		}

		user.classes.push({ classId, role });
		await user.save();

		if (role === "student") {
			await ClassModel.findOneAndUpdate(
				{ _id: classId },
				{ $push: { students: user._id } }
			);
		} else if (role === "teacher") {
			await ClassModel.findOneAndUpdate(
				{ _id: classId },
				{ $push: { teachers: user._id } }
			);
		}

		return Response.json(
			{
				success: true,
				message: "User added successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error adding user", error);
		return Response.json(
			{
				success: false,
				message: "Error adding user",
			},
			{ status: 400 }
		);
	}
}
