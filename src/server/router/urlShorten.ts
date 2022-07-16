import { createHash } from 'crypto';

import normalizeUrl from 'normalize-url';
import { z } from 'zod';

import { prisma } from '@server/db/client';

import { createRouter } from './context';

export const urlShortenRouter = createRouter().mutation('shorten', {
    input: z.object({
        url: z.string().url().trim(),
    }),
    async resolve({ input }) {
        const normalizedUrl = normalizeUrl(input.url);
        const hash = hashUrl(normalizedUrl);
        const urlExists = await findByShortUrl(hash);
        if (!urlExists) {
            await createEntity(normalizedUrl, hash);
        }

        return hash;
    },
});

const hashUrl = (url: string) =>
    createHash('sha256').update(url).digest('hex').slice(0, 16);

const findByShortUrl = (shortUrl: string) =>
    prisma.shortenUrl.findUnique({
        where: {
            short_url: shortUrl,
        },
    });

const createEntity = (url: string, short_url: string) =>
    prisma.shortenUrl.create({
        data: {
            url,
            short_url,
        },
    });
