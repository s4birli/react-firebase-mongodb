const Team = require("../models").Team;
const Player = require("../models").Player;

exports.add = async (req, res, next) => {
    try {
        const { name, nationality, players } = req.body;

        const team = await Team.create({
            name,
            nationality,
            players
        });

        await Player.updateMany({ _id: { $in: players } }, { $set: { team: team._id } })

        return res.json({ result: true, team });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.index = async (req, res, next) => {
    try {
        const teams = await Team.find({});
        return res.json({ result: true, teams });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name, nationality, players, _id } = req.body;
        const oldTeam = await Team.findByIdAndUpdate(_id, {
            name,
            nationality,
            players
        });

        const newTeam = await Team.findById(_id);
        const oldPlayers = oldTeam.toJSON()?.players;
        const removedPlayers = oldPlayers?.filter(player => !players?.includes(player));
        const addedPlayers = players?.filter(player => !oldPlayers?.includes(player));

        await Player.updateMany({ _id: { $in: removedPlayers } }, { $set: { team: null } })
        await Player.updateMany({ _id: { $in: addedPlayers } }, { $set: { team: newTeam._id } })

        return res.json({ result: true, team: newTeam });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Team.findByIdAndDelete(id);

        const team = data.toJSON();
        if (team?.players?.length) {
            await Player.updateMany({ _id: { $in: team.players } }, { $set: { team: null } })
        }
        return res.json({ result: true, id });
    } catch (error) {
        next(error);
    }
};
