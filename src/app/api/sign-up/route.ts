import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
	// first extract the info from the request body
	try {
		await dbConnect();
		const { firstName, lastName, email, password } = await request.json();

		// First check if the email already exists
		const user = await UserModel.findOne({
			email,
		});

		if (user) {
			return Response.json(
				{
					success: false,
					message: "User already exists",
				},
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new UserModel({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			classes: [],
		});
		console.log(newUser);

		if (!newUser) {
			console.log("User not created");
			return Response.json(
				{
					success: false,
					message: "Invlaid user data",
				},
				{ status: 400 }
			);
		}

		await newUser.save();

		return Response.json({
			success: true,
			message: "Ok",
		});
	} catch (error) {
		console.log("Error signup", error);
		return Response.json(
			{
				success: false,
				message: "error",
			},
			{ status: 500 }
		);
	}
}
