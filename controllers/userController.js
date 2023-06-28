const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  await User
  .find({ })
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((error) => {
    res.status(400).send(error);
  });
};

const createUser = async (req, res) => {

  const user = new User(req.body);
  const token = user.createToken().then(() => {
    res.status(200).send({user,token});
  })
  .catch((error) => {
    res.status(400).send(error.message);
  });
};

const getUserById = async (req, res) => {
  await User
  .findById(req.params.userId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).json({ message: "error"}));
};

const updateUser = async (req, res) => {
  const allow = ["email", "password"];
  const fields = Object.keys(req.body);
  const valid = fields.every((field) => allow.includes(field));

  if (valid) {
    try {
      const id = req.params.userId;
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).send("User not found");
      }
      fields.forEach((element) => (user[element] = req.body[element]));
      await user.save();
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    const notAllowed = fields.filter((field) => !allow.includes(field));
    res.status(400).send(`You cannot edit ${notAllowed} field`);
  }
};
const deleteUser = async (req, res) => {
  User
  .findByIdAndDelete(req.params.userId)
  .then((data) => {
    if (data) {
      res.send(`User with id: ${req.params.userId} has been deleted successfully`);
    } else {
      res.status(400).send(`User with id: ${req.params.userId} not found`);
    }
  })
  .catch((e) => {
    res.status(500).send(e);
  });
};


module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};