import { publicProcedure, router } from "../trpc";
import { signUpSchema } from "../../../common/validation/auth";
import * as trpc from "@trpc/server";
import z from "zod";
import { prisma } from "../../../common/prisma";
import { constants } from "crypto";
import {messageSchema,  messageCreateSchema} from "../../../common/validation/message";


export const chatrouter = router({
  getAllMessages: publicProcedure
    .output(z.array(messageSchema))
    .query(async ({ ctx }) => {
      const messages =  ctx.prisma.message.findMany({
        select: {
          Text: true,
          Day: true,
          UserId: true,
          User: {
            select : {
              name: true,
              imageprofile: true,
            }
          }, 
        },
      });
      const messageParse = z.array(messageSchema).parse(messages);
      return messageParse;
    }),
});