const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
    },
    players: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Player",
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

TeamSchema.index({
  "$**": "text",
});

TeamSchema.plugin(require("mongoose-autopopulate"));

TeamSchema.post("init", function (doc) {
  console.log("%s has been initialized from the db", doc._id);
});

TeamSchema.post("remove", function (doc) {
  console.log("%s has been removed", doc._id);
});

module.exports = mongoose.model("Team", TeamSchema);
