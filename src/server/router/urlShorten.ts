import { createRouter } from "./context";
import { z } from "zod";
import { createHash } from 'crypto';
import { prisma} from "../db/client";
import normalizeUrl from 'normalize-url';

export const urlShortenRouter = createRouter()
  .mutation("shorten", {
    input: z
      .object({
        url: z.string().url(),
      }),
    async resolve({ input, ctx }) {
        const normalizedUrl = normalizeUrl(input.url);
        const hash = createHash('sha256').update(normalizedUrl).digest('hex').slice(0,16);
        const urlExists = await prisma.shortenUrl.findUnique({
            where: {
                 short_url: hash
            }
        });
        if(!urlExists) {
            await prisma.shortenUrl.create({
                data: {
                    url: normalizedUrl,
                    short_url: hash
                }
            });
        }

        return hash;
    },
  });
