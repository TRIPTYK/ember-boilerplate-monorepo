import { email, object, string } from "zod";
import type z from "zod";

export const UserValidationSchema = object({
  firstName: string().min(1, "First name is required"),
  lastName: string().min(1, "Last name is required"),
  email: email("Invalid email address"),
  id: string().optional().nullable(),
});
export default UserValidationSchema;

export type ValidatedUser = z.infer<typeof UserValidationSchema>;
