import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface cardProps {
	className: string;
	classId: string;
	section?: string;
	subject: string;
	teacherName: string;
}

export default function ClassCard({
	className,
	classId,
	section,
	subject,
	teacherName,
}: cardProps) {
	return (
		<div className="block hover:shadow-lg transform transition-all hover:scale-105">
			<Link href={`/c/${classId}`}>
				<Card className="w-80 bg-gray-50 border border-black rounded-lg shadow-md p-4 hover:bg-gray-100">
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-gray-800">
							{className}
						</CardTitle>
						{section && (
							<CardDescription className="text-sm text-gray-500">
								Section: {section}
							</CardDescription>
						)}
					</CardHeader>
					<CardContent>
						<p className="text-base text-gray-700 font-semibold">
							{subject}
						</p>
					</CardContent>
					<CardFooter>
						<p className="text-sm text-gray-600 font-medium">
							{teacherName}
						</p>
					</CardFooter>
				</Card>
			</Link>
		</div>
	);
}
