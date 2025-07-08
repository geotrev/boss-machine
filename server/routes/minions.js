const express = require("express");
const router = express.Router();
const db = require("../db.js");
const workRoutes = require("./work");

router.use("/", workRoutes);

// middleware

const setMinion = (req, res, next) => {
  const minion = db.getFromDatabaseById("minions", req.params.id);

  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send("Minion ID is invalid");
  }
};

// routes

router.get("/", (_, res) => {
  res.status(200).send(db.getAllFromDatabase("minions"));
});

router.get("/:id", setMinion, (req, res) => {
  res.status(200).send(req.minion);
});

router.post("/", (req, res) => {
  const newMinion = req.body;
  if (
    typeof newMinion.name !== "string" ||
    typeof newMinion.weaknesses !== "string" ||
    typeof newMinion.title !== "string" ||
    typeof newMinion.salary !== "number"
  ) {
    return res.status(400).send();
  }

  const newMinionWithId = db.addToDatabase("minions", newMinion);
  res.status(201).send(newMinionWithId);
});

router.put("/:id", setMinion, (req, res) => {
  const id = req.params.id;
  const updatedMinionInfo = req.body;

  const updatedMinion = db.updateInstanceInDatabase("minions", {
    id,
    ...req.minion,
    ...updatedMinionInfo,
  });

  if (updatedMinion) {
    res.status(200).send(updatedMinion);
  } else {
    res.status(404).send("Couldn't update idea, try again later");
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const isDeleted = db.deleteFromDatabasebyId("minions", id);

  if (isDeleted) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
