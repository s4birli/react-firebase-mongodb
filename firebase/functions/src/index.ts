import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
//import * as bodyParser from "body-parser";
//import { Users } from "./models/user.model"
import { Teams } from "./models/team.model";
//import { Players } from "./models/player.model";
//import * as cors from "cors";
import * as jwt from "jsonwebtoken";
import { Players } from "./models/player.model";
const cors = require("cors");
//const cors = require("cors")({ origin: true });

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = admin.firestore();
const PlayerCollection = db.collection('Players');
const TeamsCollection = db.collection('Teams');

app.get("/", (req, res) => res.status(200).send("Working!"));

app.get("/req", (req, res) => res.status(200).send(req.query.username));

//Login
app.post("/auth/login", async (req, res) => {
    const UsersCollection = db.collection("Users");
    const userDetails = await UsersCollection.where(
        "email",
        "==",
        "demo@example.com"
    )
        .where("password", "==", "demo#123")
        .get();

    if (userDetails.empty) {
        res.json({
            result: false,
            token: {},
        });
    }

    const expirationTimeSeconds = Date.now() + 1000 * 60 * 60 * 24 * 10;

    let id: any = "";
    userDetails.forEach((doc) => {
        id = doc.id;
    });
    const token = jwt.sign(
        {
            exp: Math.floor(expirationTimeSeconds / 1000),
            uid: id,
        },
        "myS3cr3tK3y"
    );

    res.status(200).json({
        result: true,
        token: {
            access_token: token,
            expires_in: new Date(expirationTimeSeconds),
            token_type: "bearer",
        },
    });
});

//Team\\
//** Add **/
app.post("/team", async (req, res) => {
    try {
        const name = req.body.name || null;
        const nationality = req.body?.nationality || "";
        const players = req.body?.players || [];

        const team: Teams = {
            name: name,
            nationality: nationality,
            players: players,
        };



        const teamDocument = await TeamsCollection.where(
            "name",
            "==",
            team.name
        ).get();

        if (teamDocument.empty) {
            const newTeam = await TeamsCollection.add(team);
            const newTeamData = await newTeam.get();

            for (let player of players) {
                PlayerCollection.doc(player).update({ team: newTeamData.id })
            }

            res.status(200).json({
                result: true,
                team: {
                    ...newTeamData.data(),
                    _id: newTeamData.id
                },
            });
        } else {
            res.json({
                result: false,
                team: {},
            });
        }
    } catch (error) {
        console.log;
        res.status(500).json({
            error: error,
        });
    }
});

//** Update **/
app.put("/team", async (req, res) => {
    const name = req.body.name || null;
    const nationality = req.body?.nationality || "";
    const players = req.body?.players || [];
    const _id = req.body?._id;

    const teamDocuments = await db.collection("Teams").doc(_id);

    const oldTeam = await teamDocuments.get();
    const oldPlayers = oldTeam.data()?.players;
    const removedPlayers = oldPlayers?.filter((player: any) => !players?.includes(player));
    const addedPlayers = players?.filter((player: any) => !oldPlayers.includes(player));


    await teamDocuments.update({
        name,
        nationality,
        players,
    });

    const teamData = await db.collection("Teams").doc(_id).get();
    for (let playerId of removedPlayers) {
        await PlayerCollection.doc(playerId).update({ team: null })
    }

    for (let playerId of addedPlayers) {
        await PlayerCollection.doc(playerId).update({ team: teamData.id })
    }

    return res.json({
        result: true,
        team: {
            ...teamData.data(),
            _id: teamData.id
        }
    });
});

//** GetAll **/
app.get("/team", async (req, res) => {
    const teamDocuments = await db.collection("Teams").get();
    res.status(200).json({
        result: true,
        teams: teamDocuments.docs.map((doc) => {
            return {
                ...doc.data(),
                _id: doc.id,
            };
        }),
    });
});

//** Delete by name **/
app.delete("/team/:id", async (req, res) => {
    const { id } = req.params;
    const teamData = await TeamsCollection.doc(id).get();

    await db.collection("Teams").doc(id).delete();

    if (teamData.data()?.players?.length) {
        for (let playerId of teamData.data()?.players) {
            await PlayerCollection.doc(playerId).update({ team: null })
        }
    }
    res.status(200).json({
        result: true,
    });
});

//Player\\
//** Add **/
app.post("/player", async (req, res) => {
    try {
        const name = req.body?.name || null;
        const lastName = req.body?.lastName || "";
        const nationality = req.body?.nationality || "";
        const birthday = req.body?.birthday || "";
        const position = req.body?.position || [];
        const team = req.body?.team || null;

        const player: Players = {
            name: name,
            lastName: lastName,
            nationality: nationality,
            birthday: birthday,
            position: position,
            team: team,
        };

        const newPlayer = await PlayerCollection.add(player);
        const playerData = await newPlayer.get();

        if (team) {
            await db.collection('Teams').doc(team).update({ players: admin.firestore.FieldValue.arrayUnion(playerData.id) });
        }

        res.status(200).json({
            result: true,
            player: {
                ...playerData.data(),
                _id: playerData.id
            },
        });
    } catch (error) {
        console.log;
        res.status(500).json({
            error: error,
        });
    }
});

//** Update **/
app.put("/player", async (req, res) => {
    const name = req.body?.name || null;
    const lastName = req.body?.lastName || "";
    const nationality = req.body?.nationality || "";
    const birthday = req.body?.birthday || "";
    const position = req.body?.position || [];
    const team = req.body?.team || null;
    const _id = req.body?._id;

    const playerDocuments = await db.collection("Players").doc(_id);

    const oldData = await playerDocuments.get();

    await playerDocuments.update({
        name,
        lastName,
        birthday,
        position,
        nationality,
        team,
    });

    const player = await db.collection("Players").doc(_id).get();
    if (oldData.data()?.team !== player.data()?.team) {
        if (team) {
            await db.collection('Teams').doc(team).update({ players: admin.firestore.FieldValue.arrayUnion(_id) });
        }
        if (oldData.data()?.team)
            await db.collection('Teams').doc(oldData.data()?.team).update({ players: admin.firestore.FieldValue.arrayRemove(_id) });
    }

    return res.json({
        result: true,
        player: {
            ...player.data(),
            _id: player.id
        },
    });
});

//** GetAll **/
app.get("/player", async (req, res) => {
    const playerDocuments = await db.collection("Players").get();
    res.status(200).json({
        result: true,
        players: playerDocuments.docs.map((doc) => {
            return {
                ...doc.data(),
                _id: doc.id,
            };
        }),
    });
});

//** GetAll **/
app.get("/player/players", async (req, res) => {
    const playerDocuments = await db
        .collection("Players")
        .where("team", "==", null)
        .get();
    res.status(200).json({
        result: true,
        nonePlayers: playerDocuments.docs.map((doc) => {
            return {
                ...doc.data(),
                _id: doc.id,
            };
        }),
    });
});

//** Delete by name **/
app.delete("/player/:id", async (req, res) => {
    const { id } = req.params;
    const player = await db.collection('Players').doc(id).get();
    await db.collection("Players").doc(id).delete();
    if (player.data()?.team) {
        await db.collection('Teams').doc(player.data()?.team).update({ players: admin.firestore.FieldValue.arrayRemove(id) });
    }
    res.status(200).json({
        result: true,
    });
});

exports.app = functions.https.onRequest(app);
