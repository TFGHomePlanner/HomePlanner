import { publicProcedure, router } from "../trpc";
import { listSchema } from "../../../common/validation/list";
import z from "zod";
import { listsSchemaCreate, favouritesProductsSchema} from "../../../common/validation/list";

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
                name: item,
                isPurchased: false,
              
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

  getAllFavouritesProducts: publicProcedure
    .input(z.object({ groupId: z.string()}))
    .query(async ({input, ctx}) => {
      return await ctx.prisma.favouritesProducts.findMany({
        select: {
          name: true,
        },
        where : {
          groupId: input.groupId,
        }
      });      
    }),

  getListById: publicProcedure
    .input(z.object({ groupId: z.string(), listId: z.string() }))
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
          id: input.listId,
        }
      });
      const messageParse = z.array(listSchema).parse(lists);
      return messageParse;
    }),
  updateProduct: publicProcedure
    .input(z.object({id: z.string(), isPurchased: z.boolean()}))
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedProduct = await ctx.prisma.product.update({
          where: { id: input.id },
          data: { isPurchased: input.isPurchased },
        });
        if(input.isPurchased) {
          return {
            success: "added",
            message: "Correct Update",
            product: updatedProduct,
          };
        }
        else {
          return {
            success: "deleted",
            message: "Correct Update",
            product: updatedProduct,
          };
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw new Error("No se pudo actualizar el producto.");
      }
    })
});