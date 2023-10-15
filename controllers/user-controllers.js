const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
        const authToken = jwt.sign(createdUser.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        res.json({ status: "success", result: { authToken } });
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
      const authToken = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.json({
        status: "success",
        //{ id: userData.id },
        result: {
          authToken,
          user: userData,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  logout: (req, res, next) => {
    req.logout();
    console.log("登出", req.user);
    return res.json({
      status: "success",
      message: "成功登出!",
    });
  },
  getAllUsers: async (req, res, next) => {
    try {
      const currentUser = req.user;
      // 之後加入撇除自己以外的user
      const allUsers = await User.findAll({
        where: {
          id: {
            [Op.not]: currentUser.id,
          },
        },
        attributes: { exclude: ["password"] },
      });
      res.json({
        status: "success",
        result: allUsers,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = userController;
