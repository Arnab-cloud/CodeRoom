import dbConnect from "@/lib/dbConnect";
import ClassModel from "@/models/Class";
import UserModel from "@/models/User";

export async function POST(request: Request) {
	const { email, classId, archivedState } = await request.json();

	try {
		await dbConnect();
		const user = await UserModel.findOne({
			email,
			classes: {
				$elemMatch: { classId: classId, role: "teacher" },
			},
		});

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "Unauthorized",
				},
				{ status: 401 }
			);
		}

		const resultClass = await ClassModel.findOneAndUpdate(
			{ _id: classId },
			{ isArchived: archivedState }
		);

		if (!resultClass) {
			return Response.json(
				{
					success: false,
					message: "Error in updating archive",
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Archive updated successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error archive class", error);
		return Response.json(
			{
				success: false,
				message: "Error archive class",
			},
			{ status: 500 }
		);
	}
}
