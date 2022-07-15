// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { urlShortenRouter } from "./urlShorten";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge(urlShortenRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
