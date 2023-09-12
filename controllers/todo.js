import mongoose from "mongoose";
import User from "../models/user.js";
import Todo from "../models/todo.js";
import { calculateStartAndEndDate } from "../utils/utils.js";

export const createTask = async (req, res) => {
  const { title, status, description, email } = req.body;
  const { startDate, endDate } = calculateStartAndEndDate();

  if (!title || !status || !description || !email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "An error occurred" });
  }

  try {
    const task = new Todo({
      title,
      status,
      description,
      dueDate: endDate,
      user: existingUser._id,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    await task.save({ session });
    existingUser.tasks.push(task);
    await existingUser.save({ session });

    await session.commitTransaction();

    return res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const tasks = await Todo.find();

    return res
      .status(201)
      .json({ message: "Task retrieved successfully", tasks });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const getAllTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const task = await Todo.findById({ _id: id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res
      .status(201)
      .json({ message: "Task retrieved successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const updateTaskByID = async (req, res) => {
  const { id } = req.params;
  const { title, status, description } = req.body;

  try {
    if (!title || !status || !description || !id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const updatedtask = await Todo.findByIdAndUpdate(
      id,
      { title, status, description },
      { new: true }
    );

    if (!updatedtask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res
      .status(201)
      .json({ message: "Updated task successfully", updatedtask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const deleteTaskByID = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const deletedTask = await Todo.findByIdAndDelete({ _id: id });

    try {
      async () => {
        await User.findByIdAndUpdate(email, {
          $pull: { tasks: deletedTask._id },
        });
      };
    } catch (err) {
      return res.status(500).json({ message: "An error occurred" });
    }

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the deleted Task ID from the user's Task array
    await User.updateOne(
      { _id: deletedTask.user },
      { $pull: { tasks: deletedTask._id } }
    );

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
