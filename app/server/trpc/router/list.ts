import { publicProcedure, router } from "../trpc";
import { listSchema } from "../../../common/validation/list";
import * as trpc from "@trpc/server";
import z from "zod";
import { prisma } from "../../../common/prisma";

export const listrouter = router({
  getAllLists: publicProcedure
    .input(z.object({ groupId: z.string(), isClosed: z.boolean() }))
    .output(z.array(listSchema))
    .query(async ({ input, ctx }) => {
      const lists = await ctx.prisma.list.findMany({
        select: {
          name: true,
          description: true,
          isClosed: true,
          id: true,
          items: {
            select: {
              isPurchased: true,
              name: true,
              id: true,   
            },
          },
        },
        where: {
          groupId: input.groupId,
          isClosed: input.isClosed,
        }
      });
      const messageParse = z.array(listSchema).parse(lists);
      return messageParse;
    }),
});