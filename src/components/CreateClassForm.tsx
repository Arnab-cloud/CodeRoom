import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { joinClassSchema } from "@/schemas/joinClassSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { createClassSchema } from "@/schemas/createClassSchema";

const CreateClassForm = ({
	setIsCreateFormOpen,
}: {
	setIsCreateFormOpen: (isCreateFormOpen: boolean) => void;
}) => {
	const { data: session } = useSession();
	const email = session?.user.email;
	if (!email) {
		return <div>You are not signed in</div>;
	}
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof createClassSchema>>({
		resolver: zodResolver(createClassSchema),
		defaultValues: {
			className: "New Class",
			section: "",
			subject: "Coding",
		},
	});

	const onSubmit = async ({
		className,
		section,
		subject,
	}: z.infer<typeof createClassSchema>) => {
		setIsSubmitting(true);
		try {
			// console.log(values);
			const result = await axios.post<ApiResponse>("/api/create-class", {
				className,
				section,
				subject,
				teacherEmail: email,
			});

			toast({
				title: "Room created successfully",
				description: result.data.message,
				variant: "default",
			});
			console.log("Room created", result.data.classId);
			router.replace(`/h/c/${result.data.classId}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(
				"Error creating class",
				axiosError.response?.data.message
			);
			toast({
				title: "Error creating class",
				variant: "destructive",
			});
		} finally {
			setIsCreateFormOpen(false);
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow"
				>
					<FormField
						name="className"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Class Name</FormLabel>
								<Input
									{...field}
									placeholder="eg.. New Class"
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="section"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Section</FormLabel>
								<Input {...field} placeholder="section name" />
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="subject"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subject</FormLabel>
								<Input {...field} placeholder="subject" />
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
								Please Wait
							</>
						) : (
							"Create"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default CreateClassForm;
