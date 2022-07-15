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
    resolve({ input }) {
        const hash = createHash('sha256').update(input.url).digest('hex');
        return hash.slice(0, 16);
    },
  });
