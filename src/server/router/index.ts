import superjson from 'superjson';

import { createRouter } from './context';
import { urlShortenRouter } from './urlShorten';

export const appRouter = createRouter()
    .transformer(superjson)
    .merge(urlShortenRouter);

export type AppRouter = typeof appRouter;
