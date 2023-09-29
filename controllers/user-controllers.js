const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error("Password do not match!");
    }
    User.findOne({ where: { account: req.body.account } })
      .then((user) => {
        if (user) throw new Error("Email has already used!");
        return bcrypt.hash(req.body.password, 10);
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          account: req.body.account,
          password: hash,
        })
      )
      .then((createdUser) => {
        res.json({ status: "success", createdUser });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  },
  login: (req, res, next) => {
    try {
      const userData = req.user;
      const authToken = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.json({
        status: "success",
        data: {
          authToken,
          user: userData,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  logout: (req, res, next) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/login");
  },
  getAllUsers: async (req, res, next) => {
    try {
      const currentUser = req.user;
      // 之後加入撇除自己以外的user
      const allUsers = await User.findAll();
      const usersWithoutPassword = allUsers.map((user) => {
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      });
      res.json(usersWithoutPassword);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = userController;
