"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpValidation } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const SignupPage: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof signUpValidation>>({
		resolver: zodResolver(signUpValidation),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpValidation>) => {
		console.log(values);
		try {
			setIsSubmitting(true);
			const result = await axios.post<ApiResponse>(
				"/api/sign-up",
				values
			);
			console.log("sign up successful");
			toast({
				title: "Success",
				description: result.data.message,
				variant: "default",
			});

			router.replace("/sign-in");
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message;
			console.log("Error sign-up", errorMessage);
			toast({
				title: "Sign-up failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow"
				>
					<h2 className="text-2xl font-bold text-center text-gray-800">
						Sign Up
					</h2>
					<FormField
						name="firstName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<Input {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="lastName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<Input {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<Input {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="password"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<Input {...field} type="password" />
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
								Please Wait
							</>
						) : (
							"Sign up"
						)}
					</Button>
					<div className="text-center mt-r">
						<p>
							Already a member?{" "}
							<Link
								href="/sign-in"
								className="text-blue-600 hover:text-blue-800"
							>
								Sign in
							</Link>
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SignupPage;
