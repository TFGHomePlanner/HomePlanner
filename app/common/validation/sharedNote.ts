import * as z from "zod";

export const SharedNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string().optional().nullable(),
  userId: z.string(),
  groupId: z.string(),
});

export const CreatedSharedNoteSchema = z.object({
  title: z.string(),
  text: z
    .string()
    .max(600, {
      message: "Máximo 600 caracteres.",
    })
    .nullable(),
  userId: z.string(),
  groupId: z.string(),
});

export type ISharedNote = z.infer<typeof SharedNoteSchema>;
export type ICreateSharedNote = z.infer<typeof CreatedSharedNoteSchema>;
