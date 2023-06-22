const express = require('express');
const router = express.Router();

router.use("/", require("./swagger"));
router.use("/user", require("./userRoute"));
router.use("/task", require("./taskRoute"));

module.exports = router;