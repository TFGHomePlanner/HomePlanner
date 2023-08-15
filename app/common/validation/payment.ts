
import { z } from "zod";

export const PayMentSchema= z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date(),
  payments: z.array(z.object({
    payingUser: z.object({
      name: z.string(),
    }),
    createdAt: z.coerce.date(),
    debtorUsers: z.array(z.object({
      amount: z.number(),
      debtor: z.object({
        name: z.string(),
        id: z.string(),
      }),
    })),
  })),
});


export type IPayment = z.infer<typeof PayMentSchema>;

