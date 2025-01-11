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

const JoinClassForm = ({
	setIsJoinFormOpen,
}: {
	setIsJoinFormOpen: (isJoinFormOpen: boolean) => void;
}) => {
	const { data: session } = useSession();
	const email = session?.user.email;
	if (!email) {
		return <div>You are not signed in</div>;
	}
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof joinClassSchema>>({
		resolver: zodResolver(joinClassSchema),
		defaultValues: {
			joinCode: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof joinClassSchema>) => {
		setIsSubmitting(true);
		try {
			console.log(values);
			const result = await axios.post<ApiResponse>("/api/join-class", {
				email,
				joiningCode: values.joinCode,
			});

			toast({
				title: "Joined successfully",
				description: result.data.message,
				variant: "default",
			});
			console.log("User joined", result.data.classId);
			router.replace(`/h/c/${result.data.classId}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(
				"Error joining class",
				axiosError.response?.data.message
			);
			toast({
				title: "Error joining class",
				description: axiosError.response?.data.message,
				variant: "destructive",
			});
		} finally {
			setIsJoinFormOpen(false);
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
						name="joinCode"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<Input
									{...field}
									placeholder="Enter code ..."
								/>
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
							"Join"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default JoinClassForm;
