// src/controllers/post.controller.js
const { Op } = require("sequelize");
const db = require("../models");
const Post = db.Post;
const Author = db.Author;
const { APIResponseUtils } = require("../utils/apiResponse/apiResponse");

const PostController = {
  findAll: async (req, res) => {
    try {
      const { id, author_id, title, page = 1, limit = 10 } = req.query;

      let whereClause = { deletedAt: false };
      if (id) whereClause.id = id;
      if (author_id) whereClause.author_id = author_id;
      if (title) whereClause.title = { [Op.like]: `%${title}%` };

      const { count, rows } = await Post.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [["id", "ASC"]],
        include: [
          {
            model: Author,
            as: "author",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      });

      return APIResponseUtils.sendOkResponse(
        res,
        "Posts retrieved successfully",
        {
          data: rows,
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
        }
      );
    } catch (error) {
      console.error("Error in findAll:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error retrieving posts"
      );
    }
  },

  create: async (req, res) => {
    try {
      const { author_id, title, description, content } = req.body;
      const newPost = await Post.create({
        author_id,
        title,
        description,
        content,
      });
      return APIResponseUtils.sendCreatedResponse(
        res,
        newPost,
        "Post created successfully"
      );
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((e) => e.message);
        return APIResponseUtils.sendBadRequestResponse(
          res,
          "Validation Error",
          messages
        );
      }
      console.error("Error in create:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error creating post"
      );
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, content } = req.body;
      const [updated] = await Post.update(
        { title, description, content },
        { where: { id } }
      );
      if (updated) {
        const updatedPost = await Post.findByPk(id, {
          include: [
            {
              model: Author,
              as: "author",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        });
        return APIResponseUtils.sendOkResponse(
          res,
          "Post updated successfully",
          updatedPost
        );
      }
      return APIResponseUtils.sendNotFoundResponse(res, "Post not found");
    } catch (error) {
      console.error("Error in update:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error updating post"
      );
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Post.destroy({ where: { id } });
      if (deleted) {
        return APIResponseUtils.sendOkResponseOnlyMessage(
          res,
          "Post deleted successfully"
        );
      }
      return APIResponseUtils.sendNotFoundResponse(res, "Post not found");
    } catch (error) {
      console.error("Error in delete:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error deleting post"
      );
    }
  },

  softDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Post.update(
        { deletedAt: true },
        { where: { id } }
      );
      if (updated) {
        return APIResponseUtils.sendOkResponseOnlyMessage(
          res,
          "Post soft deleted successfully"
        );
      }
      return APIResponseUtils.sendNotFoundResponse(res, "Post not found");
    } catch (error) {
      console.error("Error in softDelete:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error soft deleting post"
      );
    }
  },
};

module.exports = PostController;
