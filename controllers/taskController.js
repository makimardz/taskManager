const Task = require('../models/taskModel');

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function createTask(req, res) {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function getTask(req, res) {
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteTask(req, res) {
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  deleteTask,
};