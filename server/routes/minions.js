const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/", (req, res) => {
  res.status(200).send(db.getAllFromDatabase("minions"));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const minion = db.getFromDatabaseById("minions", id);

  if (minion) {
    res.status(200).send(minion);
  } else {
    res.status(404).send();
  }
});

router.post("/", (req, res) => {
  const newMinion = req.body;
  if (
    !newMinion ||
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

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedMinionInfo = req.body;
  const minion = db.getFromDatabaseById("minions", id);

  if (!updatedMinionInfo) {
    return res.status(404).send("Missing minion data");
  }

  if (!minion) {
    return res.status(404).send("Invalid id provided or minion not found");
  }

  const updatedMinion = db.updateInstanceInDatabase("minions", {
    ...minion,
    ...updatedMinionInfo,
  });
  res.status(200).send(updatedMinion);
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
