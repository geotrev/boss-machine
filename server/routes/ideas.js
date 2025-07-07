const express = require("express");
const router = express.Router();
const db = require("../db.js");

// APIS:
// - createMeeting
// - getAllFromDatabase
// - getFromDatabaseById
// - addToDatabase
// - updateInstanceInDatabase
// - deleteFromDatabasebyId
// - deleteAllFromDatabase

router.get("/", (req, res) => {
  res.status(200).send(db.getAllFromDatabase("ideas"));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const minion = db.getFromDatabaseById("ideas", id);

  if (minion) {
    res.status(200).send(minion);
  } else {
    res.status(404).send();
  }
});

router.post("/", (req, res) => {
  const newIdea = req.body;
  if (
    !newIdea ||
    typeof newIdea.name !== "string" ||
    typeof newIdea.description !== "string" ||
    typeof newIdea.weeklyRevenue !== "number" ||
    typeof newIdea.numWeeks !== "number"
  ) {
    return res.status(400).send();
  }

  const newIdeaWithId = db.addToDatabase("ideas", newIdea);
  res.status(201).send(newIdeaWithId);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedIdea = req.body;
  const idea = db.getFromDatabaseById("ideas", id);

  if (Object.keys(updatedIdea).length === 0) {
    return res.status(404).send("Missing idea data");
  }

  if (!idea) {
    return res.status(404).send("Invalid id provided or idea not found");
  }

  const updatedMinion = db.updateInstanceInDatabase("ideas", {
    ...idea,
    ...updatedIdea,
  });
  res.status(200).send(updatedMinion);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const isDeleted = db.deleteFromDatabasebyId("ideas", id);

  if (isDeleted) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
