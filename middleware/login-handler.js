const bycrypt = require("bcryptjs");
const { User } = require("../models");

const userLogin = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    if (!account || !password) throw new Error("帳號密碼皆為必填!");
    const user = await User.findOne({ where: { account } });
    if (!user) throw new Error("帳號或密碼錯誤!");

    const passwordMatch = await bycrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("帳號或密碼錯誤");
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { userLogin };
