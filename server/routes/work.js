const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db.js");

// NOTE:
// - Fix minions and ideas PUT methods to merge rows when partial data is provided
// - Update these routes to precheck minionId and workId params
// - Provide middleware that preloads work or minion data into the request object

// middleware

const setMinionWork = (req, res, next) => {
  const id = req.params.minionId;

  const allWork = db.getAllFromDatabase("work", id);
  const minionsWork = allWork.filter((work) => work.minionId === id);

  req.minionsWork = minionsWork;
  next();
};

const isValidMinionId = (req, res, next) => {
  const isValidMinion = !!db.getFromDatabaseById(
    "minions",
    req.params.minionId
  );

  if (isValidMinion) {
    next();
  } else {
    res.status(404).send();
  }
};

// routes

router.get("/:minionId/work", isValidMinionId, setMinionWork, (req, res) => {
  res.status(200).send(req.minionsWork);
});

router.post("/:minionId/work", isValidMinionId, (req, res) => {
  const newWork = req.body;

  if (
    typeof newWork.title !== "string" ||
    typeof newWork.description !== "string" ||
    typeof newWork.hours !== "number" ||
    typeof newWork.minionId !== "string"
  ) {
    return res.status(400).send("Invalid work provided");
  }

  const newWorkWithId = db.addToDatabase("work", newWork);
  res.status(201).send(newWorkWithId);
});

router.put("/:minionId/work/:workId", isValidMinionId, (req, res) => {});

module.exports = router;
