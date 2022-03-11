import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.statics.getUnfinished = async function (user) {
  const tasks = await this.find({ owner: user, completed: false });
  return tasks;
};
taskSchema.methods.markDone = async function (user) {
  const task = this;
  await task.update({ completed: true });
  await task.save();
  return true;
};
taskSchema.methods.isOwner = async function (user) {
  const task = this;
  return (await task.owner) == user;
};

export const TaskModel = model("Task", taskSchema);
