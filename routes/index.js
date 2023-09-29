const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controllers");
const travelController = require("../controllers/group-controller");
const passport = require("../config/passport");
const { userLogin } = require("../middleware/login-handler");
const { apiErrorHandler } = require("../middleware/error-handler");

router.post("/splitWizard/register", userController.signUp);
router.post("/splitWizard/login", userLogin, userController.login);
router.post("/splitWizard/logout", userController.logout);
router.get("/splitWizard/api/messages", (req, res) => {
  const messages = {
    success_messages: res.locals.success_messages,
    error_messages: res.locals.error_messages,
  };
  res.json(messages);
});
router.get("/splitWizard/groups", travelController.getTravels);
router.get("/splitWizard/allUsers", userController.getAllUsers);
router.post("/splitWizard/addGroup", travelController.addTravel);
router.use("/", apiErrorHandler);
router.get("/", (req, res) => {
  res.send("This is SW from express router");
});

module.exports = router;
