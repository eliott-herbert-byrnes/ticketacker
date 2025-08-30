import z from "zod";

export const SignUpfilesSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine((v) => !v.includes(" "), "Username cannot contain spaces"),
    email: z.string().min(1, "Is required").max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });