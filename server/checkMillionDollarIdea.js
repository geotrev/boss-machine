const checkMillionDollarIdea = (req, res, next) => {
  const idea = req.body;

  const isOneMil = idea.numWeeks * idea.weeklyRevenue >= 1000000;
  if (!isOneMil) {
    return res.status(400).send("Idea isn't worth 1 million!");
  }

  next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
