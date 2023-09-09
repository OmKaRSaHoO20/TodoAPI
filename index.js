import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./database/database.js";
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";

config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/user", userRouter);
app.use("/todo", todoRouter);

connectDB();

// Open port to connection for api endpoints
app.listen(PORT, cors(), (req, res) => {
  console.log(`The server is now active at port ${process.env.PORT}`);
});
