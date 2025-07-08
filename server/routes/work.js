const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db.js");

// middleware

const setMinionWork = (req, res, next) => {
  const minionId = req.params.minionId;
  const allWork = db.getAllFromDatabase("work");

  if (allWork) {
    const minionsWork = allWork.filter((work) => work.minionId === minionId);
    req.minionsWork = minionsWork;

    next();
  } else {
    res.status(404).send("Couldn't retrieve work");
  }
};

const isValidMinionId = (req, res, next) => {
  const isValidMinion = !!db.getFromDatabaseById(
    "minions",
    req.params.minionId
  );

  if (isValidMinion) {
    next();
  } else {
    res.status(404).send("Minion ID is invalid");
  }
};

const validateWork = (req, res, next) => {
  const minionId = req.params.minionId;
  const workId = req.params.workId;
  const work = db.getFromDatabaseById("work", workId);

  if (work) {
    if (minionId !== undefined && work?.minionId !== minionId) {
      return res
        .status(400)
        .send("Minion ID was invalid for the provided work");
    }

    req.work = work;

    next();
  } else {
    res.status(404).send("Work ID is invalid");
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

router.put("/:minionId/work/:workId", validateWork, (req, res) => {
  const workId = req.params.workId;
  const updatedWorkInfo = req.body;

  const updatedWork = db.updateInstanceInDatabase("work", {
    id: workId,
    ...req.work,
    ...updatedWorkInfo,
  });

  if (updatedWork) {
    res.status(200).send(updatedWork);
  } else {
    res.status(404).send("Couldn't update idea, try again later");
  }
});

router.delete("/:minionId/work/:workId", validateWork, (req, res) => {
  const isDeleted = db.deleteFromDatabasebyId("work", req.work.id);

  if (isDeleted) {
    return res.status(204).send();
  }

  res.status(404).send("Unable to delete work");
});

module.exports = router;
