// routes/author.routes.js
const express = require("express");
const router = express.Router();
const AuthorController = require("../controllers/author.controller");
const authMiddleware = require("../middleware/auth.middleware");

//Public routes
router.post("/", AuthorController.create);
router.post("/login", AuthorController.login);

//Protected routes
router.get("/", authMiddleware, AuthorController.findAll);
router.put("/", authMiddleware, AuthorController.update);
router.delete("/", authMiddleware, AuthorController.softDelete);
router.delete(
  "/permanent-delete",
  authMiddleware,
  AuthorController.permanentDelete
);

module.exports = router;
