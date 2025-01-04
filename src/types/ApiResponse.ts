import { Class } from "@/models/Class";
import { User } from "@/models/User";
import { ObjectId } from "mongoose";

export interface ApiResponse {
	success: boolean;
	message: string;
	classId?: string;
	classes?: Array<Class>;
	users?: [
		{
			students?: Array<User>;
			teachers?: Array<User>;
		}
	];
}
