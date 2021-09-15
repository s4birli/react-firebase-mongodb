const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: false,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
    },

    birthday: {
      type: Date,
      required: true,
    },
    position: {
      type: [String],
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
  },
  {
    timestamps: true,
    strict: false,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {},
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.pro;
      },
    },
  }
);

PlayerSchema.index({
  "$**": "text",
});

PlayerSchema.plugin(require("mongoose-autopopulate"));

PlayerSchema.post("init", function (doc) {
  console.log("%s has been initialized from the db", doc._id);
});

PlayerSchema.post("remove", function (doc) {
  console.log("%s has been removed", doc._id);
});

module.exports = mongoose.model("Player", PlayerSchema);
