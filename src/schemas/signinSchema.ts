import { z } from "zod";
import { emailValidation, passwordValidation } from "./signupSchema";

export const signInValidation = z.object({
	email: emailValidation,
	password: passwordValidation,
});
