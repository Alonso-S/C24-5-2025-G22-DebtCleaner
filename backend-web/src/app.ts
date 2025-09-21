import express from "express";
import { errorHandler } from "./common/middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(errorHandler);

export default app;
