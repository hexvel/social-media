import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  username: z
    .string()
    .regex(
      /^[a-zA-Zа-яёА-ЯЁ0-9]+$/,
      "Username can only contain letters and numbers",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(1000, "Content must be at most 1000 characters long"),
  mediaIds: z.array(z.string()).max(5, "Max 5 media per post"),
});

export const updateUserProfileSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
  bio: z.string().trim().max(200, "Bio must be at most 200 characters long"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
