//Follows Assignment Requirements 
const router = require("express").Router();
const {
  getAllUsersFunc,
  getIDUserFunc,
  createUserFunc,
  updateUserFunc,
  deleteFriendFunc,
  addFriendFunc,
  deleteUserFunc,
} = require("../../controllers/user-controller");

router.route("/").get(getAllUsersFunc).post(createUserFunc);
router.route("/:id").get(getIDUserFunc).put(updateUserFunc).delete(deleteUserFunc);
router.route("/:userId/friends/:friendId").post(addFriendFunc).delete(deleteFriendFunc);
module.exports = router;