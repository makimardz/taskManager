const connection = require("../db/config");
const taskModule = require("../model/taskModel");
const multer = require("multer");

/**
 * Route handler for getting all tasks of a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const allTasks = async (req, res) => {
  try {
    // Populate user's tasks
    await req.user.populate('tasks')
    const { tasks } = req.user
    // Send tasks back to client
    res.status(200).send(tasks)
  } catch (error) {
    // Handle error
    res.status(500).send(error)
  }
};

/**
 * Adds a new task to the database for the authenticated user
 * @param {Object} req - the request object containing the authenticated user and task data
 * @param {Object} res - the response object
 */
const addTask = async (req, res) => {
  try {
    // Get the owner ID from the authenticated user object
    const owner = req.user._id;
    // Create a new task object with the request body data and owner ID
    const task = new taskModule({ ...req.body, owner });
    // Save the new task to the database
    await task.save();
    // Return the new task as a response
    res.status(200).send(task);
  } catch (err) {
    // Handle any errors by returning a 400 status with the error message
    const errorMessage = err.message;
    res.status(400).send(errorMessage);
  }
}
/**
 * Retrieves a single task with a given ID belonging to the authenticated user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<Object>} The task object matching the specified ID.
 * @throws {Error} If an error occurs while retrieving the task.
 */
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
/**
 * Update a task with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the task has been updated.
 */
const updateTask = async (req, res) => {
    // Define allowed fields for update
    const allow = ["description", "completed"];

    // Get fields from request body
    const fields = Object.keys(req.body);

    // Check if all fields are allowed
    const valid = fields.every((field) => allow.includes(field));

    if (valid) {
        try {
            // Get task ID from request parameters
            const _id = req.params.taskId;

            // Find task by ID and owner
            const task = await taskModule.findOne({ _id, owner: req.user._id });

            // Return error if task not found
            if (!task) {
                return res.status(404).send("Task not found");
            }

            // Update task fields with values from request body
            fields.forEach((element) => (task[element] = req.body[element]));

            // Save updated task
            await task.save();

            // Return updated task
            res.status(200).send(task);
        } catch (err) {
            // Return error if update fails
            res.status(500).send(err.message);
        }
    } else {
        // Get fields not allowed for update
        const notAllowed = fields.filter((field) => !allow.includes(field));

        // Return error if not all fields are allowed
        res.status(400).send(`You cannot edit ${notAllowed} field`);
    }
};

const deleteTask = async (req, res) => {
    try {
        const data = await taskModule.findOneAndDelete({ _id: req.params.taskId, owner: req.user._id });
        if (data) {
            res.send(`task with id: ${req.params.taskId} has been deleted`);
        } else {
            res.status(404).send(`task id: ${req.params.taskId} not found`);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

module.exports = { allTasks, addTask, getSingleTask, updateTask, deleteTask };