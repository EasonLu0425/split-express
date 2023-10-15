const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const userController = require("../controllers/user-controllers");
const itemController = require("../controllers/item-controller");
const travelController = require("../controllers/group-controller");
const userGroupConnController = require("../controllers/userGroupConn-controller");
const notificationController = require("../controllers/notification-controller");
const itemDetailController = require("../controllers/itemDetail-controller");
const resultController = require("../controllers/result-controller");
const { apiErrorHandler } = require("../middleware/error-handler");
const { authenticated } = require("../middleware/auth");

router.post("/splitWizard/register", userController.signUp);
router.post(
  "/splitWizard/login",
  passport.authenticate("local", {
    failureFlash: true,
    session: false,
  }),
  userController.login
);
router.post("/splitWizard/logout", userController.logout);
router.get(
  "/splitWizard/groups/:groupId/:userId/details",
  // authenticated,
  itemDetailController.getUserInGroupDetail
);
router.get(
  "/splitWizard/groups/:groupId/:itemId/edit",
  authenticated,
  itemController.getItem
);
router.put(
  "/splitWizard/groups/:groupId/switchResultStatus",
  authenticated,
  resultController.switchResultStatus
);
router.put(
  "/splitWizard/groups/:groupId/resetRedirect",
  authenticated,
  travelController.resetGroupRedirect
);
router.put(
  "/splitWizard/groups/:groupId/setArchive",
  authenticated,
  travelController.putArchive
);
router.put(
  "/splitWizard/groups/:groupId/:itemId",
  authenticated,
  itemController.editItem
);
router.put(
  "/splitWizard/groups/:groupId/:itemId/editItemDetails",
  authenticated,
  itemDetailController.editItemDetails
);
router.delete(
  "/splitWizard/groups/:groupId/:itemId/details",
  authenticated,
  itemDetailController.deleteItemDetails
);
router.get(
  "/splitWizard/groups/:groupId/members",
  authenticated,
  travelController.getTravelMembers
);
router.get(
  "/splitWizard/groups/:groupId/overView",
  authenticated,
  userGroupConnController.getOverview
);
router.get(
  "/splitWizard/groups/:groupId/getResult",
  authenticated,
  resultController.getResult
);
router.post(
  "/splitWizard/groups/:groupId/createSettlements",
  authenticated,
  resultController.createResult
);
router.get(
  "/splitWizard/groups/:groupId/:itemId",
  authenticated,
  itemController.getItem
);
router.post(
  "/splitWizard/groups/:groupId/:itemId/addItemDetails",
  authenticated,
  itemDetailController.addItemDetails
);
router.delete(
  "/splitWizard/groups/:groupId/:itemId",
  authenticated,
  itemController.deleteItem
);
router.post(
  "/splitWizard/groups/:groupId/addItem",
  authenticated,
  itemController.addItem
);
router.get(
  "/splitWizard/groups/:groupId",
  authenticated,
  travelController.getTravel
);
router.get("/splitWizard/groups", authenticated, travelController.getTravels);
router.post(
  "/splitWizard/addMemberToGroup",
  authenticated,
  userGroupConnController.addMemberToGroup
);
router.post("/splitWizard/addGroup", authenticated, travelController.addTravel);
router.get(
  "/splitWizard/allMembers",
  authenticated,
  userController.getAllUsers
);
router.get(
  "/splitWizard/getNotifications",
  authenticated,
  notificationController.getNotifications
);
router.post(
  "/splitWizard/readNotification",
  authenticated,
  notificationController.readNotification
);
router.post(
  "/splitWizard/addNotifications",
  authenticated,
  notificationController.addNotification
);
router.get("/splitWizard/test-token", authenticated, (req, res)=> {
  res.json({
    success:true,
    message:'驗證成功'
  })
});
router.use("/", apiErrorHandler);
router.get("/", (req, res) => {
  res.send("This is SW from express router");
});

module.exports = router;
