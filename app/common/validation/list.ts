
import * as z from "zod";

export const listSchema = z.object({
  name: z.string().min(1, "El campo no puede estar vacío"),
  description: z.string().nullable(),
  isClosed: z.boolean(),
  id: z.string(),
  items: z.array(z.object ({
    name: z.string().min(1, "el nombre no puede ser vacio"),
    isPurchased : z.boolean(),
    id: z.string(),
  })),
});

export const listsSchemaCreate = listSchema.extend({
  groupId: z.string().nullable(), 
});

export type IListCreate = z.infer<typeof listsSchemaCreate>;
export type IList = z.infer<typeof listSchema>;