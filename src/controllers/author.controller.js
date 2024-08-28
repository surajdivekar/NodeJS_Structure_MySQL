// controllers/author.controller.js
const { Op } = require("sequelize");
const db = require("../models");
const Author = db.Author;
const { APIResponseUtils } = require("../utils/apiResponse/apiResponse");

// Helper function to check if an author exists
const authorExists = async (id) => {
  const author = await Author.findOne({ where: { id, is_deleted: false } });
  return author !== null;
};

const AuthorController = {
  findAll: async (req, res) => {
    try {
      const {
        id,
        first_name,
        last_name,
        email,
        birthdate,
        page = 1,
        limit = 20,
      } = req.query;

      // If ID is provided, check if the author exists
      if (id) {
        const exists = await authorExists(id);
        if (!exists) {
          return APIResponseUtils.sendNotFoundResponse(
            res,
            `Author with id ${id} does not exist in the database`
          );
        }
      }

      let whereClause = { is_deleted: false };
      if (id) whereClause.id = id;
      if (first_name) whereClause.first_name = { [Op.like]: `%${first_name}%` };
      if (last_name) whereClause.last_name = { [Op.like]: `%${last_name}%` };
      if (email) whereClause.email = { [Op.like]: `%${email}%` };
      if (birthdate) whereClause.birthdate = birthdate;

      const { count, rows } = await Author.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [["id", "ASC"]],
      });

      return APIResponseUtils.sendOkResponse(
        res,
        "Authors retrieved successfully",
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
        "Error retrieving authors"
      );
    }
  },

  create: async (req, res) => {
    try {
      const { first_name, last_name, email, password, birthdate } = req.body;
      const newAuthor = await Author.create({
        first_name,
        last_name,
        email,
        password,
        birthdate,
      });

      // Remove password from the response
      const authorResponse = newAuthor.toJSON();
      delete authorResponse.password;

      return APIResponseUtils.sendCreatedResponse(
        res,
        authorResponse,
        "Author created successfully"
      );
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const messages = error.errors.map((e) => e.message);
        const errorMessage = messages.join(". ");
        return APIResponseUtils.sendBadRequestResponse(
          res,
          errorMessage,
          messages
        );
      }
      console.error("Error in create:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error creating author"
      );
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Use the 'withPassword' scope to include the password for this query
      const author = await Author.scope("withPassword").findOne({
        where: { email },
      });

      if (!author) {
        return APIResponseUtils.sendUnauthorizedResponse(
          res,
          "Invalid email or password"
        );
      }

      const isPasswordValid = await author.checkPassword(password);

      if (!isPasswordValid) {
        return APIResponseUtils.sendUnauthorizedResponse(
          res,
          "Invalid email or password"
        );
      }

      const token = author.generateToken();

      // Exclude password from the response
      const { password: _, ...authorData } = author.get();

      return APIResponseUtils.sendOkResponse(res, "Login successful", {
        token,
        author: authorData,
      });
    } catch (error) {
      console.error("Error in login:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error during login"
      );
    }
  },

  update: async (req, res) => {
    try {
      const { id = null, first_name, last_name, email, birthdate } = req.body;

      // Check if the id is provided
      if (!id) {
        return APIResponseUtils.sendBadRequestResponse(
          res,
          "ID is required to update an author"
        );
      }
      // Check if the author exists
      const exists = await authorExists(id);
      if (!exists) {
        return APIResponseUtils.sendNotFoundResponse(
          res,
          `Author with id ${id} does not exist in the database`
        );
      }

      const [updated] = await Author.update(
        { first_name, last_name, email, birthdate },
        { where: { id, is_deleted: false } }
      );
      if (updated) {
        const updatedAuthor = await Author.findByPk(id);
        return APIResponseUtils.sendOkResponse(
          res,
          "Author updated successfully",
          updatedAuthor
        );
      }
      return APIResponseUtils.sendNotFoundResponse(res, "Author not found");
    } catch (error) {
      console.error("Error in update:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return APIResponseUtils.sendConflictResponse(
          res,
          "Email already in use"
        );
      }
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error updating author"
      );
    }
  },

  softDelete: async (req, res) => {
    try {
      const { id } = req.query;

      console.log("Received ID for soft delete:", id);

      // Check if the id is provided
      if (!id) {
        return APIResponseUtils.sendBadRequestResponse(
          res,
          "ID is required to delete an author"
        );
      }

      // Check if the author exists, including those already soft deleted
      const author = await Author.findOne({ where: { id } });
      if (!author) {
        return APIResponseUtils.sendNotFoundResponse(
          res,
          `Author with id ${id} does not exist in the database`
        );
      }

      // Check if the author is already soft deleted
      if (author.is_deleted) {
        return APIResponseUtils.sendBadRequestResponse(
          res,
          "Author has already been soft deleted"
        );
      }

      const [updated] = await Author.update(
        { is_deleted: true },
        { where: { id, is_deleted: false } }
      );

      if (updated) {
        return APIResponseUtils.sendOkResponse(
          res,
          "Author deleted successfully"
        );
      }

      return APIResponseUtils.sendNotFoundResponse(res, "Author not found");
    } catch (error) {
      console.error("Error in softDelete:", error);

      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error soft deleting author"
      );
    }
  },

  permanentDelete: async (req, res) => {
    try {
      // const { id } = req.params;
      const { id } = req.query;
      // Check if the id is provided
      if (!id) {
        return APIResponseUtils.sendBadRequestResponse(
          res,
          "ID is required to Delete an author"
        );
      }
      // Check if the author exists
      const exists = await Author.findOne({ where: { id } });
      if (!exists) {
        return APIResponseUtils.sendNotFoundResponse(
          res,
          `Author with id ${id} does not exist in the database`
        );
      }

      const deleted = await Author.destroy({ where: { id } });
      if (deleted) {
        return APIResponseUtils.sendOkResponse(
          res,
          "Author deleted successfully"
        );
      }
      return APIResponseUtils.sendNotFoundResponse(res, "Author not found");
    } catch (error) {
      console.error("Error in delete:", error);
      return APIResponseUtils.sendInternalServerErrorResponse(
        res,
        "Error deleting author"
      );
    }
  },
};

module.exports = AuthorController;
