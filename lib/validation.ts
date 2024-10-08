import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString
    .regex(
      /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/,
      "Only letters, a single numbers, _ allowed",
    )
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be at most 30 characters"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  username: requiredString
    .regex(
      /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/,
      "Only letters, numbers, a single _ allowed",
    )
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be at most 30 characters"),
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
