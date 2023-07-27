import { publicProcedure, router } from "../trpc";
import { listSchema } from "../../../common/validation/list";
import z from "zod";
import { listsSchemaCreate } from "../../../common/validation/list";

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
  createList: publicProcedure
    .input(listsSchemaCreate)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.list.create({
        data: {
          name: input.name,
          description: input.description,
          isClosed: false,
          group: { connect: { id: input.groupId } },
          items: {
            createMany: {
              data: input.items.map((item) => ({
                name: item.name,
                isPurchased: item.isPurchased,
              
              })),
            },
          },
        
        },
      });
      return {
        status: 201,
        message: "Mensaje Creado correctamente",
      };
    }),
});
