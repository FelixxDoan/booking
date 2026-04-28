import express from "express";
import cors from "cors";

import { prisma } from "./config/db.js";
import { ok } from "./common/utils/response.js";
import handleError from "./common/middlewares/handleError.js";

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get("/healthz", (req, res) => {
    res.status(200).json({ message: "Service run well" });
  });

  app.get("/checkdb", async (req, res, next) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        ok: true,
        message: "Server and database are healthy",
      });

      ok(res, null, "Server and database are healthy");
    } catch (error) {
      next(error);
    }
  });

  app.use(handleError);

  return app
};

export default createApp;
