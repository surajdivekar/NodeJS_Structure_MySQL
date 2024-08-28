const express = require("express");
const _route = express.Router();

// Import your route files
const authorRoutes = require("./author.routes");
const postRoutes = require("./post.routes");

_route.get("/", (req, res) => {
  res.send({
    status: true,
    data: {
      title: `Default Route`,
      message: `You reached a dead end route, please follow the documentation for appropriate route.`,
    },
  });
});

// Apply your routes
_route.use("/authors", authorRoutes);
_route.use("/posts", postRoutes);

module.exports = _route;
