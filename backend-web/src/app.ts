import express from "express";
import { errorHandler } from "./common/middleware/errorHandler";
import { authRouter } from "./modules/auth";
const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use(errorHandler);

export default app;
