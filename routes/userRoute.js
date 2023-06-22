const router = require('express').Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

router.get("/", auth, userController.allUsers);

router.post("/", auth, userController.createUser);
router.post("/login", auth, userController.login);

router.get("/:id", auth, userController.getSingleUser);

router.post("/update/:id", auth, userController.updateUser);

router.delete("/:id", auth, userController.deleteUser);
router.delete("/logout", auth, userController.logout);

module.exports = router;