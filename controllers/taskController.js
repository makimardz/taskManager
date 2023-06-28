const Task = require('../models/taskModel');

const getAllTasks = async (req, res) => {
  try {
    await req.user.populate('tasks')
    res.status(200).send(req.user.tasks);

  } catch (error) {
    res.status(500).send(error);
  }
};

const createTask = async (req, res) => {
  try {
    const task = new Task({...req.body,owner:req.user._id});
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getTaskById = async (req, res) => {
  try {
    const _id = req.params.taskId;
    const task = await Task.findOne({ _id, owner: req.user._id, });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).json({ message: "error", err: error.message });
  }
};

const updateTask = async (req, res) => {
  const allow = ["description", "complete"];
  const fields = Object.keys(req.body);
  const valid = fields.every((field) => allow.includes(field));
  if (valid) {
  try {
    const _id = req.params.taskId;
    const task = await Task.findOne({_id,owner: req.user._id});
    if (!task) {
      return res.status(404).send("Task not found");
    }
    fields.forEach((element) => (task[element] = req.body[element]));
    await task.save();
    res.ststus(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
  } else {
    const notAllowed = fields.filter((field) => !allow.includes(field));
    res.status(400).send(`${notAllowed} is not allowed`);
  }
};
  
const deleteTask = (req, res) => {
  Task
  .findOneAndDelete({_id:req.params.taskId,owner: req.user._id})
  .then((data) => {
    if (data) {
      res.send(`Task with id: ${req.params.taskId} has been deleted successfully`);
    } else {
      res.status(400).send(`Task with id: ${req.params.taskId} not found`);
    }
  })
  .catch((e) => {
    res.status(500).send(e);
  });
};
  

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};