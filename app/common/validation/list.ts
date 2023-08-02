
import * as z from "zod";

export const listSchema = z.object({
  name: z.string().min(1, "El campo no puede estar vacío"),
  description: z.string().nullable(),
  isClosed: z.boolean(),
  isPublic: z.boolean(),
  creatorId: z.string(),
  id: z.string(),
  items: z.array(z.object ({
    name: z.string().min(1, "el nombre no puede ser vacio"),
    isPurchased : z.boolean(),
    id: z.string(),
  })),
});

export const listsSchemaCreate = z.object({
  name: z.string().min(1, "El campo no puede estar vacío"),
  description: z.string().min(1, "El campo no puede estar vacío"),
  groupId: z.string(),
  items: z.array(z.string().min(1, "el nombre no puede ser vacio")),
  creatorId: z.string().min(1, "Ha de ser creada por alguien"),
  isPublic: z.boolean(),

});

export const favouritesProductsSchema = z.object({
  name: z.string().min(1, "minimo un caracter"),

});

export type IFavouriteProduct = z.infer<typeof favouritesProductsSchema>;
export type IListCreate = z.infer<typeof listsSchemaCreate>;
export type IList = z.infer<typeof listSchema>;