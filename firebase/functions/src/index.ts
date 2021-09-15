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
    const TeamsCollection = db.collection("Teams");
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
      res.status(200).json({
        result: true,
        team: newTeam,
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
  const { _id, name, nationality, players } = req.body;
  const teamDocuments = await db.collection("Teams").doc(_id);
  await teamDocuments.update({
    name,
    nationality,
    players,
  });
  const team = (await db.collection("Teams").doc(_id).get()).data();
  return res.json({
    result: true,
    team,
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
  await db.collection("Teams").doc(id).delete();

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

    const PlayerCollection = db.collection("Players");
    const player: Players = {
      name: name,
      lastName: lastName,
      nationality: nationality,
      birthday: birthday,
      position: position,
      team: team,
    };

    const newPlayer = await PlayerCollection.add(player);
    res.status(200).json({
      result: true,
      player: (await newPlayer.get()).data(),
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
  const { _id, name, lastName, birthday, position, team } = req.body;
  const playerDocuments = await db.collection("Players").doc(_id);
  await playerDocuments.update({
    name,
    lastName,
    birthday,
    position,
    team,
  });
  const playerObj = (await db.collection("Players").doc(_id).get()).data();
  return res.json({
    result: true,
    playerObj,
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
  await db.collection("Players").doc(id).delete();

  res.status(200).json({
    result: true,
  });
});

exports.app = functions.https.onRequest(app);
