const { User, Thought } = require("../models");
//Examples from Module Code were used 
const uController = {
  //GET ALL USERS
  getAllUsersFunc(req, res) {
    User.find({})
      .populate({path: "friends",select: "-__v",})
      .select("-__v")
      .sort({ _id: -1 })
      .then((db) => res.json(db))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //GET USER BY ID 
  getIDUserFunc({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({path: "thoughts",select: "-__v",})
      .populate({path: "friends",select: "-__v",})
      .select("-__v")
      .then((db) => {
        if (!db) {
          return res
            .status(404)
            .json({ message: "Error" });
        }
        res.json(db);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //CREATE USER
  createUserFunc({ body }, res) {
    User.create(body)
      .then((db) => res.json(db))
      .catch((err) => res.json(err));
  },

  //UPDATE USER 
  updateUserFunc({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {new: true,runValidators: true,})
      .then((db) => {
        if (!db) {
          res.status(404).json({ message: "Error" });
          return;
        }
        res.json(db);
      })
      .catch((err) => res.json(err));
  },

   //ADD FRIEND FUNCTION
   addFriendFunc({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId },{ $addToSet: { friends: params.friendId } },{ new: true, runValidators: true })
      .then((db) => {
        if (!db) {
          res.status(404).json({ message: "Error" });
          return;
        }
        res.json(db);
      })
      .catch((err) => res.json(err));
  },

  //DELETEFRIENDFUNCTION
  deleteFriendFunc({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId },{ $pull: { friends: params.friendId } },{ new: true })
      .then((db) => {
        if (!db) {
          return res.status(404).json({ message: "Error" });
        }
        res.json(db);
      })
      .catch((err) => res.json(err));
  },

  //DELETE USER FUNCTION
  deleteUserFunc({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((db) => {
        if (!db) {
          return res.status(404).json({ message: "Error" });
        }
        return Thought.deleteMany({ _id: { $in: db.thoughts } }); //delete many is used to delete all associated items unique to the user, this ensures that the user's content is deleted 
      })
      .then(() => {
        res.json({ message: "Great Success WAH WHA WEE WAH" });
      })
      .catch((err) => res.json(err));
  },

 
};
module.exports = uController;