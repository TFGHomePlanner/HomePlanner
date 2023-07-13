import express from "express";
import { appRouter } from "./app/server/trpc/router/_app";
import { createContext } from "./app/server/trpc/context";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(
  "/trpc",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:19000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  },
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000);