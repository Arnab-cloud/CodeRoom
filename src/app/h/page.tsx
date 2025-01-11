import ClassCard from "@/components/ClassCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
// import { useSession } from "next-auth/react";

const HomePage: React.FC = async () => {
	const session = await getServerSession(authOptions); // here auth options has to be provided or session object might be different
	console.log("session from Home page", session?.user._id);
	if (!session) {
		return <div>User is not logged in</div>;
	}

	try {
		const userId = session.user._id;
		if (!userId) {
			return <div>User id not provided</div>;
		}
		const result = await axios.get<ApiResponse>(
			`http://localhost:3000/api/${userId}/get-classes?ia=0`
		);

		const classes = result.data.classes;
		// console.log("Classes", classes);

		return (
			<div className=" p-4 flex flex-row gap-4 flex-wrap">
				{classes &&
					classes.map((classItem, index) => (
						<ClassCard
							key={index}
							classId={classItem.classId}
							className={classItem.className}
							section={classItem.section}
							subject={classItem.subject}
							teacherName={classItem.teachers[0].fullName}
						/>
					))}
			</div>
		);
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse>;

		return <div>{axiosError.response?.data.message}</div>;
	}
};

export default HomePage;
