const express = require("express");
const router = express.Router();
const passport = require('../config/passport');
const userController = require("../controllers/user-controllers");
const itemController = require("../controllers/item-controller");
const travelController = require("../controllers/group-controller");
const userGroupConnController = require("../controllers/userGroupConn-controller");
const notificationController = require('../controllers/notification-controller')
const itemDetailController = require('../controllers/itemDetail-controller')
const { userLogin } = require("../middleware/login-handler");
const { apiErrorHandler } = require("../middleware/error-handler");

router.post("/splitWizard/register", userController.signUp);
router.post(
  "/splitWizard/login",
  passport.authenticate("local", {
    failureFlash: true,
  }),
  userController.login
);
router.post("/splitWizard/logout", userController.logout);
router.get("/splitWizard/api/messages", (req, res) => {
  const messages = {
    success_messages: res.locals.success_messages,
    error_messages: res.locals.error_messages,
  };
  res.json(messages);
});
router.get("/splitWizard/groups/:groupId/:itemId/edit", itemController.getItem);
router.put("/splitWizard/groups/:groupId/:itemId", itemController.editItem);
router.put("/splitWizard/groups/:groupId/:itemId/details", itemDetailController.editItemDetails);
router.get("/splitWizard/groups/:groupId/members", travelController.getTravelMembers);
router.get("/splitWizard/groups/:groupId/:itemId",itemController.getItem);
router.post("/splitWizard/groups/:groupId/:itemId/addItemDetails",itemDetailController.addItemDetails);
router.delete("/splitWizard/groups/:groupId/:itemId", itemController.deleteItem);
router.post("/splitWizard/groups/:groupId/addItem", itemController.addItem);
router.get("/splitWizard/groups/:groupId", travelController.getTravel);
router.get("/splitWizard/groups", travelController.getTravels);
router.post("/splitWizard/addMemberToGroup",  userGroupConnController.addMemberToGroup );
router.post("/splitWizard/addGroup", travelController.addTravel);
router.get("/splitWizard/allMembers", userController.getAllUsers);
router.get("/splitWizard/getNotifications", notificationController.getNotifications);
router.post("/splitWizard/readNotification", notificationController.readNotification);
router.post("/splitWizard/addNotifications",notificationController.addNotification);
router.use("/", apiErrorHandler);
router.get("/", (req, res) => {
  res.send("This is SW from express router");
});

module.exports = router;
