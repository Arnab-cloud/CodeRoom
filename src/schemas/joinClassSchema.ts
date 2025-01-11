import { z } from "zod";
import { joinValidation } from "./createClassSchema";

export const joinClassSchema = z.object({
	joinCode: joinValidation,
});
