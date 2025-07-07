const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/", (req, res) => {
  res.status(200).send(db.getAllFromDatabase("meetings"));
});

router.post("/", (req, res) => {
  const newMeeting = db.createMeeting();
  const newMeetingWithId = db.addToDatabase("meetings", newMeeting);

  res.status(201).send(newMeetingWithId);
});

router.delete("/", (req, res) => {
  db.deleteAllFromDatabase("meetings");
  res.status(204).send();
});

module.exports = router;
