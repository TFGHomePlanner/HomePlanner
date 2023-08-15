import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PayMentSchema } from "../../../common/validation/payment";


export const paymentRouter = router({
  getAllPaymentsSections: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .output(z.array(PayMentSchema))
    .query(async ({ ctx, input }) => {
      const paymentSection =  await ctx.prisma.paymentSection.findMany({
        select : {
          id: true,
          title: true,
          description: true,
          totalAmount: true, 
          createdAt: true,    
          payments: {
            select: {
              payingUser: {
                select: {
                  name: true,
                }
              },
              createdAt: true,
              debtorUsers:
                    {
                      select: {
                        amount: true,
                        debtor: {
                          select: {
                            name: true,
                            id: true,
                          }
                        }
                      }  
                    }
            }
          }
        },
        where: {
          groupId: input.groupId,
        },       
      });
      return z.array(PayMentSchema).parse(paymentSection);
    }),
  createPaymentSection: publicProcedure
    .input(z.object({ groupId: z.string(), title: z.string(), description: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const paymentSection = await ctx.prisma.paymentSection.create({
        data: {
          title: input.title,
          description: input.description,
          groupId: input.groupId,
          totalAmount: 0.0,
        },
      });
      return paymentSection;
    })
});
