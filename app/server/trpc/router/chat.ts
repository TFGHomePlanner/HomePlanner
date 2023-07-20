import { publicProcedure, router } from "../trpc";
import z from "zod";
import { messageSchema } from "../../../common/validation/message";



export const chatrouter = router({
  getAllMessages: publicProcedure
    .input(z.object({ GroupId: z.string() }))
    .output(z.array(messageSchema))
    .query(async ({ input, ctx }) => {
      const messages = await ctx.prisma.message.findMany({
        select: {
          Text: true,
          Day: true,
          UserId: true,
          Id : true,
          User: {
            select: {
              name: true,
              imageprofile: true,
            },
          },
        },
      });
      console.log(messages);
      const messageParse = z.array(messageSchema).parse(messages);
      console.log("si");
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
