import { z } from "zod";

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  codeGroup: z.string(),
  adminId: z.string(),
  description: z.string().optional().nullable(),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export const CreateGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  codeGroup: z.string(),
  adminId: z.string(),
  description: z
    .string()
    .max(200, {
      message: "La descripción no puede tener más de 200 caracteres.",
    })
    .optional()
    .nullable(),
  users: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export type IGroup = z.infer<typeof GroupSchema>;
export type ICreateGroup = z.infer<typeof CreateGroupSchema>;
