import { responseHandler } from "../config/utils.js";
import { TaskModel } from "./models.js";

export const getTasks = async (req, res, next) => {
  const user = req.userId;
  const tasks = await TaskModel.getUnfinished(user);

  return responseHandler(res, "success", 200, tasks);
};
export const addTask = async (req, res, next) => {
  const user = req.userId;
  const task = req.body;
  task["owner"] = user;
  const newTask = await TaskModel.create(task);
  return responseHandler(res, "success", 201, newTask);
};

export const completeTask = async (req, res, next) => {
  const user = req.userId;
  const taskID = req.params.id;
  const task = await TaskModel.findById(taskID);
  if (!task) return responseHandler(res, "fail", 404, "Not found");
  if (await task.isOwner(user)) {
    task.markDone(user);
    return responseHandler(res, "success", 200, {});
  }
  return responseHandler(res, "fail", 401, "Delete tasks you own");
};
export const deleteTask = async (req, res, next) => {
  const user = req.userId;
  const taskID = req.params.id;
  const task = await TaskModel.findById(taskID);
  if (!task) return responseHandler(res, "fail", 404, "Not found");
  if (await task.isOwner(user)) {
    await task.delete();
    return responseHandler(res, "success", 200, {});
  }
  return responseHandler(res, "fail", 401, "Delete tasks you own");
};
