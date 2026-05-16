import "dotenv/config"; 

import express, { type Request, type Response } from "express";
import cors from "cors";
import http from "node:http";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.ts";
import { initSocket } from "./socket/socketIndex.ts";
import userRouter from "./routes/user.ts";



const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5169;

const server = http.createServer(app);
initSocket(server);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To Home Server");
});

server.listen(PORT, () => {
  console.log(`Listening Port: ${PORT}`);
});