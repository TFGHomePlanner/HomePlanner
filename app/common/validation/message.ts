
import * as z from "zod";

export const messageSchema = z.object({
  Text: z.string().min(1, "El campo no puede estar vacío"),
  Day: z.date(),
  UserId: z.string().min(1, "El campo no puede ser vacio"),
  Id: z.string(),
  User: z.object ({
    imageprofile : z.string().nullable(),
    name: z.string().min(1, "el nombre no puede ser vacio")
  })
});

export const messageCreateSchema = messageSchema.extend({
  GroupId: z.string().nullable(), 
});

export type IMessageCreate = z.infer<typeof messageCreateSchema>;
export type IMessage = z.infer<typeof messageSchema>;