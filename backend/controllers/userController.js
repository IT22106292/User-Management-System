const User = require("../models/userModel");
const moment = require("moment");

// Get users

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const usersList = users.map((user) => {
      return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: moment(user.age).utc().format("YYYY-MM-DD"),
      };
    });
    res.status(200).json(usersList);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

//Register new user

const registerUser = async (req, res, next) => {
  const { first_name, last_name, email, age } = req.body;
  try {
    if (!first_name) {
      res.status(400);
      throw new Error("Please add a first name");
    } else if (!last_name) {
      res.status(400);
      throw new Error("Please add a last name");
    } else if (!email) {
      res.status(400);
      throw new Error("Please add an email");
    } else if (!age) {
      res.status(400);
      throw new Error("Please add the age");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// Get one user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Format user age using moment
    const userData = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: moment(user.age).utc().format("YYYY-MM-DD"),
    };

    res.status(200).json(userData);
  } catch (error) {
    next(error);
    console.log(error);
  }
};


//Update user

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: `User - ${updatedUser.first_name} updated successfully`,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

//Delete user

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `User with id - ${req.params.id} deleted`,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
};

