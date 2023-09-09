import express from "express";
import { verifyJWT } from "../middleware/verification_token.js";
import {
  createTask,
  deleteTaskByID,
  getAllTask,
  getAllTaskById,
  updateTaskByID,
} from "../controllers/todo.js";

const todoRouter = express.Router();

todoRouter.use(verifyJWT);

todoRouter.post("/create-task/", createTask);
todoRouter.get("/get-all-tasks/", getAllTask);
todoRouter.get("/get-task/:id", getAllTaskById);
todoRouter.put("/update-task/:id", updateTaskByID);
todoRouter.delete("/delete-task/:id", deleteTaskByID);

export default todoRouter;
