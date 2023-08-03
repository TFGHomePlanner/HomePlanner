import * as z from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type IUser = z.infer<typeof userSchema>;
