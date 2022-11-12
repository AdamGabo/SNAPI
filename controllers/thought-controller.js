const { Thought, User } = require("../models");
//Examples from module were used for creation of thought controller
const tController = {
  //CATCH EM ALL 
  getThoughtsFunc(req, res) {
    Thought.find({})
      .populate({path: "reactions", select: "-__v",})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbTData) => res.json(dbTData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //CREATE 
  createThoughtFunc({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate({ _id: body.userId },{ $push: { thoughts: _id } },{ new: true }); //mongoose method findOneAndUpdate, updates the params for that user with that ID 
      })
      .then((dbUserData) => { // typical 404 message that states that the item was not found 
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Error" });
        }

        res.json({ message: "Success" });
      })
      .catch((err) => res.json(err));
  },

  //GET UNO 
  getThoughtViaIDFunc({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({path: "reactions",select: "-__v",})
      .select("-__v")
      .then((dbTData) => {
        if (!dbTData) 
        {return res.status(404).json({ message: "Error" });}
        res.json(dbTData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //GET VIA ID 
  updateThoughtFunc({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true,})
      .then((dbTData) => {
        if (!dbTData) {
          res.status(404).json({ message: "Error" });
          return;
        }
        res.json(dbTData);
      })
      .catch((err) => res.json(err));
  },
  //ADD DAT BOI 
  addReactionFunc({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbTData) => {
        if (!dbTData) {
          res.status(404).json({ message: "Error" });
          return;
        }
        res.json(dbTData);
      })
      .catch((err) => res.json(err));
  },
  //DELETE DAT 
  deleteReactionFunc({ params }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId },{ $pull: { reactions: { reactionId: params.reactionId } } },{ new: true })
      .then((dbTData) => res.json(dbTData))
      .catch((err) => res.json(err));
  },
  //DELETE DAT BOI 
  deleteThoughtFunc({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbTData) => {
        if (!dbTData) {
          return res.status(404).json({ message: "Error" });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, //remove the thought via a pull and update the value to be blank
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Error" });
        }
        res.json({ message: "Great Success" });
      })
      .catch((err) => res.json(err));
  },
  
};

module.exports = tController;