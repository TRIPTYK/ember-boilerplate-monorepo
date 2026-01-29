import { email, object, string } from "zod";

const LoginValidationSchema = object({
  email: email('Please enter a valid email address'),
  password: string().min(8, 'Password must be at least 8 characters'),
});

export default LoginValidationSchema;
