import { z } from "zod";
const nameRegex = /^[A-Za-z][A-Za-z\s'-]*[A-Za-z]$/;

export const firstNameValidation = z
	.string()
	.min(2, "first name must be at least 2 characters")
	.regex(
		nameRegex,
		"first name must not contain number or special characters"
	);
export const lastNameValidation = z
	.string()
	.min(2, "last name must be at least 2 characters")
	.regex(
		nameRegex,
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
