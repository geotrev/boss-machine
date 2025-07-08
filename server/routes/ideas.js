const express = require("express");
const db = require("../db.js");
const checkMillionDollarIdea = require("../checkMillionDollarIdea");

const router = express.Router();

// middleware

const setIdea = (req, res, next) => {
  const idea = db.getFromDatabaseById("ideas", req.params.id);

  if (idea) {
    req.idea = idea;
    next();
  } else {
    res.status(404).send("Idea ID is invalid");
  }
};

// routes

router.get("/", (_, res) => {
  res.status(200).send(db.getAllFromDatabase("ideas"));
});

router.get("/:id", setIdea, (req, res) => {
  res.status(200).send(req.idea);
});

router.post("/", checkMillionDollarIdea, (req, res) => {
  const newIdea = req.body;

  if (
    typeof newIdea.name !== "string" ||
    typeof newIdea.description !== "string" ||
    typeof newIdea.weeklyRevenue !== "number" ||
    typeof newIdea.numWeeks !== "number"
  ) {
    return res.status(404).send();
  }

  const newIdeaWithId = db.addToDatabase("ideas", newIdea);

  res.status(201).send(newIdeaWithId);
});

router.put("/:id", setIdea, checkMillionDollarIdea, (req, res) => {
  const id = req.params.id;
  const updatedIdeaInfo = req.body;

  const updatedIdea = db.updateInstanceInDatabase("ideas", {
    id,
    ...req.idea,
    ...updatedIdeaInfo,
  });

  if (updatedIdea) {
    res.status(200).send(updatedIdea);
  } else {
    return res.status(404).send("Couldn't update idea, try again later");
  }
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
