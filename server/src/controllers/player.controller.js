const Player = require("../models").Player;
const Team = require("../models").Team;

exports.addNewPlayer = async (req, res, next) => {
  try {
    const { name, last_name, birthday, nationality, position, team } = req.body;

    const player = await Player.create({
      name,
      last_name,
      birthday,
      nationality,
      position,
      team,
    });

    if (team) {
      await Team.updateOne({ _id: team }, { $push: { players: player._id } });
    }

    return res.json({ result: true, player });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find({});
    return res.json({ result: true, players });
  } catch (error) {
    next(error);
  }
};

exports.getNoneAssignedPlayers = async (req, res, next) => {
  try {
    const players = await Player.find({ team: null });
    return res.json({ result: true, nonePlayers: players });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, last_name, birthday, nationality, position, team, _id } =
      req.body;
    const oldData = await Player.findByIdAndUpdate(_id, {
      name,
      last_name,
      birthday,
      nationality,
      position,
      team,
    });

    const player = await Player.findById(_id);
    const oldPlayer = oldData.toJSON();

    if (oldPlayer?.team !== player.toJSON()?.team) {
      if (team)
        await Team.updateOne({ _id: team }, { $push: { players: _id } });
      await Team.updateOne(
        { _id: oldPlayer?.team },
        { $pull: { players: _id } }
      );
    }

    return res.json({ result: true, player });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Player.findByIdAndDelete(id);
    const player = data.toJSON();
    if (player?.team) {
      await Team.updateOne({ _id: player?.team }, { $pull: { players: id } });
    }
    return res.json({ result: true, id });
  } catch (error) {
    next(error);
  }
};
