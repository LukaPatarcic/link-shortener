import { createRouter } from "./context";
import { z } from "zod";
import { createHash } from 'crypto';
import { prisma} from "../db/client";

export const urlShortenRouter = createRouter()
  .mutation("shorten", {
    input: z
      .object({
        url: z.string().url(),
      }),
    async resolve({ input, ctx }) {
        const hash = createHash('sha256').update(input.url).digest('hex').slice(0,16);
        await prisma.shortenUrl.create({
             data: {
                 url: input.url,
                 short_url: hash
             }
        });
        return hash;
    },
  });
