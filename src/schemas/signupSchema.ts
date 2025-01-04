import { z } from "zod";

export const firstNameValidation = z
	.string()
	.min(2, "first name must be at least 2 characters")
	.regex(
		/^[a-zA-Z]^/,
		"first name must not contain number or special characters"
	);
export const lastNameValidation = z
	.string()
	.min(2, "last name must be at least 2 characters")
	.regex(
		/^[a-zA-Z]^/,
		"last name must not contain number or special characters"
	);

export const emailValidation = z
	.string()
	.email({ message: "Invalid email address" });

export const passwordValidation = z
	.string()
	.min(6, { message: "Password must be at least 6 characters" });

export const signUpValidation = z.object({
	firstName: firstNameValidation,
	lastName: lastNameValidation,
	email: emailValidation,
	password: passwordValidation,
});
