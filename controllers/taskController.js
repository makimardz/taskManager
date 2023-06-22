const connection = require("../db/config");
const taskModule = require("../model/taskModel");
const multer = require("multer");
const allTasks = async (req, res) => {
    try {
        await req.user.populate('tasks')

        res.stastus(200).send(req.user.tasks)

        } catch(err) {
            res.status(500).send(err)
        }
    };

const addTask = async (req, res) => {
    try {
        const task = new taskModule({...req.body,owner: req.user._id})
        await task.save();
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err.message)
    }
}
const getSingleTask = async (req, res) => {
    try {
        const _id = req.params.taskId;
        const task = await taskModule.findOne({ _id, owner: req.user._id});
        if (!task) {
            return res.status(404).send("Task not found");
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(400).json({ message: "error", err: err.message});
    }
};
const updateTask = async (req, res) => {
    const allow = ["description", "completed"];
    const fields = Object.keys(req.body);
    const valid = fields.every((field) => allow.includes(field));
    if (valid) {
        try {
            const _id = req.params.taskId;
            const task = await taskModule.findOne({ _id, owner: req.user._id });

            if (!task) {
                return res.status(404).send("Task not found");
            }
            fields.forEach((element) => (task[element] = req.body[element]));
            await task.save();
            res.status(200).send(task);
        } catch (err) {
            res.status(500).send(err.message);
    }
} else {
    const notAllowed = fields.filter((field) => !allow.includes(field));
    res.stastus(400).send("you cannot edit ${notAllowed} field");
}
};

const deleteTask = async (req, res) => {
    taskModule
    .findOneAndDelete({ _id: req.params.taskId, owner: req.user._id })
    .then((data) => {
        if (data) {
            res.send("task with id: ${req.params.taskId} has been deleted");
        } else {
            res.stastus(404).send("task id: ${req.params.taskId} not found");
        }
    })
    .catch((e) => {
        res.stastus(500).send(e);
    });
};

module.exports = { allTasks, addTask, getSingleTask, updateTask, deleteTask };