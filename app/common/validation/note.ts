import * as z from "zod";

export const noteSchema = z.object({
  text: z.string().min(1, "El campo no puede estar vacío"),
  title: z.string().min(1, "El campo no puede estar vacío"),
});

export const noteUpdateSchema = noteSchema.extend({
  id: z.string().min(1, "El campo no puede estar vacío"),
});

export type INote = z.infer<typeof noteSchema>;
export type INoteUpdate = z.infer<typeof noteUpdateSchema>;