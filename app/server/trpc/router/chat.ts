import { publicProcedure, router } from "../trpc";
import z from "zod";
import { messageSchema } from "../../../common/validation/message";

export const chatrouter = router({
  getAllMessages: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .output(z.array(messageSchema))
    .query(async ({ input, ctx }) => {
      const messages = await ctx.prisma.message.findMany({
        select: {
          text: true,
          day: true,
          userId: true,
          id : true,
          user: {
            select: {
              name: true,
              imageprofile: true,
            },
          },
        },
        where: {
          groupId: input.groupId,
        }
      });
      const messageParse = z.array(messageSchema).parse(messages);
      return messageParse;
    }),
  
  createmessage: publicProcedure
    .input(
      z.object({
        text: z.string().min(1, "No puede ser un mensaje vacío"),
        day: z.string(),
        userId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { text, day, userId, groupId} }) => {
      await ctx.prisma.message.create({
        data: {
          text,
          day, 
          user: {connect : {id: userId}},
          group : {connect: {id: groupId}},
        },
      });
      return {
        status: 201,
        message: "Mensaje Creado correctamente",
      };
    }),
});
