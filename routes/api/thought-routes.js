//following module code and requirements from Challenge 
const router = require("express").Router();
const {
  getThoughtsFunc,
  getThoughtViaIDFunc,
  createThoughtFunc,
  updateThoughtFunc,
  deleteThoughtFunc,
  addReactionFunc,
  deleteReactionFunc,
} = require("../../controllers/thought-controller");

router.route("/").get(getThoughtsFunc).post(createThoughtFunc);
router.route("/:id").get(getThoughtViaIDFunc).put(updateThoughtFunc).delete(deleteThoughtFunc);
router.route("/:thoughtId/reactions").post(addReactionFunc);
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReactionFunc);
module.exports = router;