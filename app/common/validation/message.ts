
import * as z from "zod";

export const messageSchema = z.object({
  text: z.string().min(1, "El campo no puede estar vacío"),
  day: z.date(),
  userId: z.string().min(1, "El campo no puede ser vacio"),
  User: z.object ({
    imageUrl : z.string(),
    name: z.string().min(1, "el nombre no puede ser vacio")
  })
});

export const messageCreateSchema = messageSchema.extend({
  groupId: z.string(), 
});

export type IMessageCreate = z.infer<typeof messageCreateSchema>;
export type IMessage = z.infer<typeof messageSchema>;