const express = require("express");
const db = require("../db.js");
const checkMillionDollarIdea = require("../checkMillionDollarIdea");

const router = express.Router();

const validatePostData = (req, res, next) => {
  const newIdea = req.body;
  if (
    typeof newIdea.name !== "string" ||
    typeof newIdea.description !== "string" ||
    typeof newIdea.weeklyRevenue !== "number" ||
    typeof newIdea.numWeeks !== "number"
  ) {
    return res.status(404).send();
  }

  next();
};

const validatePutData = (req, res, next) => {
  const id = req.params.id;
  const idea = db.getFromDatabaseById("ideas", id);

  if (!idea) {
    return res.status(404).send();
  }

  next();
};

router.get("/", (req, res) => {
  res.status(200).send(db.getAllFromDatabase("ideas"));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const idea = db.getFromDatabaseById("ideas", id);

  if (idea) {
    res.status(200).send(idea);
  } else {
    res.status(404).send();
  }
});

router.post("/", validatePostData, checkMillionDollarIdea, (req, res) => {
  const newIdea = req.body;
  const newIdeaWithId = db.addToDatabase("ideas", newIdea);

  res.status(201).send(newIdeaWithId);
});

router.put("/:id", validatePutData, checkMillionDollarIdea, (req, res) => {
  const id = req.params.id;
  const updatedIdeaInfo = req.body;

  // NOTE: merge with existing row
  const updatedIdea = db.updateInstanceInDatabase("ideas", {
    id,
    ...updatedIdeaInfo,
  });

  if (updatedIdea) {
    res.status(200).send(updatedIdea);
  } else {
    return res.status(404).send("Invalid id provided or idea not found");
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
