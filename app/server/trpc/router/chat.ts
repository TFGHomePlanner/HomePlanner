import { publicProcedure, router } from "../trpc";
import z from "zod";
import { messageSchema } from "../../../common/validation/message";

export const chatrouter = router({
  getAllMessages: publicProcedure
    .output(z.array(messageSchema))
    .query(async ({ ctx }) => {
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
      });
      const messageParse = z.array(messageSchema).parse(messages);
      return messageParse;
    }),
});
