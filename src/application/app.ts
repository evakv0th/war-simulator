import dotenv from "dotenv";
import express, { Request, Response } from "express";
import authRouter from "../auth/auth.router";
import userRouter from "../users/users.router";
import bodyParser from 'body-parser';
import { validatorURL } from "./middlewares/URLvalidator";
import { exceptionsFilter } from "./middlewares/error-filter";
import armyRouter from "../armies/armies.router";
import tankRouter from "../tanks/tanks.router";
import planeRouter from "../planes/planes.router";


dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("war-simulator");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/armies", armyRouter);
app.use("/api/v1/tanks", tankRouter);
app.use("/api/v1/planes", planeRouter);

app.use(validatorURL);

app.use(exceptionsFilter);

export default app;