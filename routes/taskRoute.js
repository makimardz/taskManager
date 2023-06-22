const router = require('express').Router();
const taskController = require('../controllers/taskController');

const auth = require('../middleware/auth');

router.get("/", auth, taskController.allTasks);

router.post("/", auth, taskController.addTask);

router.get("/:id", auth, taskController.getSingleTask);

router.put("/:id", auth, taskController.updateTask);

router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;