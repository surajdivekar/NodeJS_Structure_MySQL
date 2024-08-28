const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const PostController = require("../controllers/post.controller");

router.get("/", PostController.findAll);
router.post("/", PostController.create);
router.put("/:id", PostController.update);
router.delete("/:id", PostController.delete);
router.patch("/:id/soft-delete", PostController.softDelete);

module.exports = router;
