import { publicProcedure, router } from "../trpc";
import z from "zod";
import { messageSchema } from "../../../common/validation/message";


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
});
