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
import { signInValidation } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SigninPage: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof signInValidation>>({
		resolver: zodResolver(signInValidation),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signInValidation>) => {
		setIsSubmitting(true);
		try {
			console.log(values);
			const result = await signIn("credentials", {
				identifier: values.email,
				password: values.password,
				redirect: false,
			});

			if (result?.error) {
				toast({
					title: "Login Failed",
					description: "Incorrect username or password",
					variant: "destructive",
				});
			}

			if (result?.url) {
				router.replace("/home");
			}
		} catch (error) {
			console.log("Error signing up", error);
			toast({
				title: "Sign in failed",
				variant: "destructive",
			});
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow"
				>
					<h2 className="text-2xl font-bold text-center text-gray-800">
						Sign In
					</h2>

					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<Input {...field} placeholder="Email" />
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
								<Input
									{...field}
									type="password"
									placeholder="password"
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
							"Sign in"
						)}
					</Button>
					<div className="text-center mt-r">
						<p>
							Don't have an account?{" "}
							<Link
								href="/sign-up"
								className="text-blue-600 hover:text-blue-800"
							>
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SigninPage;
