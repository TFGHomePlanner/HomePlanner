import { publicProcedure, router } from "../trpc";
import z from "zod";
import { messageSchema } from "../../../common/validation/message";
import { connect } from "http2";
import { group } from "console";


export const chatrouter = router({
  getAllMessages: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .output(z.array(messageSchema))
    .query(async ({ ctx, input }) => {
      const messages = ctx.prisma.message.findMany({
        select: {
          Text: true,
          Day: true,
          UserId: true,
          User: {
            select: {
              name: true,
              imageprofile: true,
            },
          },
        },
        where: {
          GroupId: input.groupId
        }
      });
      const messageParse = z.array(messageSchema).parse(messages);
      return messageParse;
    }),
  createmessage: publicProcedure
    .input(
      z.object({
        Text: z.string().min(1, "No puede ser un mensaje vacío"),
        Day: z.date(),
        UserId: z.string(),
        GroupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { Text, Day, UserId, GroupId} }) => {
      await ctx.prisma.message.create({
        data: {
          Text,
          Day, 
          User: {connect : {id: UserId}},
          Group : {connect: {id: GroupId}},
        },
      });
      return {
        status: 201,
        message: "Mensaje Creado correctamente",
      };
    }),
    
    

});
