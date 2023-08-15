import * as z from "zod";

export const SharedNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  groupId: z.string(),
});

export const CreateSharedNoteSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine((value) => value.trim() !== "", {
      message: "Escribe un título.",
    }),
  text: z
    .string()
    .max(100, {
      message: "Máximo 600 caracteres.",
    })
    .nullable(),
  userId: z.string(),
  groupId: z.string(),
});

export type ISharedNote = z.infer<typeof SharedNoteSchema>;
export type ICreateSharedNote = z.infer<typeof CreateSharedNoteSchema>;
