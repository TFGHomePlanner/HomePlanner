
import { z } from "zod";

export const PaymentSchema = 
  z.object({
    id: z.string(),
    payingUser: z.object({
      name: z.string(),
      id: z.string(),
    }),
    title: z.string(),
    createdAt: z.coerce.date(),
    amount: z.number(),
    debtorUsers: z.array(z.object({
      amount: z.number(),
      debtor: z.object({
        name: z.string(),
        id: z.string(),
      }),
    })),
  });

export const SectionPayMentSchema= z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date(),
  participants: z.array(z.object({
    name: z.string(),
    id: z.string(),
  })),
});

export const createPaymentSchema = z.object({ 
  title: z.string(),
  paymentSectionId: z.string(), 
  payingUserId: z.string(), 
  amount: z.number(),
  debtorUsers: z.array(z.object({ 
    debtorId: z.string(), 
    amount: z.number() })) });

  




export type IPayment = z.infer<typeof PaymentSchema>;
export type IreatePayment = z.infer<typeof createPaymentSchema>;
export type IPaymentSection = z.infer<typeof SectionPayMentSchema>;

