import * as z from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});


export const userProfileSchema = userSchema.extend({
  email : z.string().min(1),
  passwordHash: z.string().min(1),
  imageprofile: z.string().nullable(),
});

export type IUserProfile = z.infer<typeof userProfileSchema>;
export type IUser = z.infer<typeof userSchema>;
