
import * as z from "zod";

export const listSchema = z.object({
  Name: z.string().min(1, "El campo no puede estar vacío"),
  Description: z.string().nullable(),
  IsClosed: z.boolean(),
  Id: z.string(),
  items: z.object ({
    name: z.string().min(1, "el nombre no puede ser vacio"),
    isPurchased : z.boolean(),
    id: z.string(),
  })
});

export const listsSchemaCreate = listSchema.extend({
  GroupId: z.string().nullable(), 
});

export type IListCreate = z.infer<typeof listsSchemaCreate>;
export type IList = z.infer<typeof listSchema>;