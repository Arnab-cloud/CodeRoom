import { z } from "zod";

export const classNameValidation = z
	.string()
	.min(2, "class name must be more than 2 characters")
	.max(20, "class name must be less than 20 characters");
export const subjectValidation = z
	.string()
	.min(2, "subject must be more than 2 characters")
	.max(20, "subject must be less than 20 characters");

export const joinValidation = z
	.string()
	.length(10, "joining code should be 10 characters long");

export const createClassSchema = z.object({
	className: classNameValidation,
	subject: subjectValidation,
	section: z.string(),
});
