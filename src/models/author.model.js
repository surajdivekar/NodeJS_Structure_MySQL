// models/author.model.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: { msg: "First name is required" },
          notEmpty: { msg: "First name cannot be empty" },
          len: {
            args: [2, 50],
            msg: "First name must be between 2 and 50 characters long",
          },
        },
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: { msg: "Last name is required" },
          notEmpty: { msg: "Last name cannot be empty" },
          len: {
            args: [2, 50],
            msg: "Last name must be between 2 and 50 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email is required" },
          isEmail: { msg: "Invalid email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password cannot be empty" },
          len: {
            args: [6, 100],
            msg: "Password must be between 6 and 100 characters long",
          },
        },
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "Birthdate is required" },
          isDate: { msg: "Invalid date format" },
          isBefore: {
            args: new Date().toISOString().split("T")[0],
            msg: "Birthdate must be in the past",
          },
        },
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "authors",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: false,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
      hooks: {
        beforeCreate: async (author) => {
          if (author.password) {
            author.password = await bcrypt.hash(author.password, 10);
          }
        },
        beforeUpdate: async (author) => {
          if (author.changed("password")) {
            author.password = await bcrypt.hash(author.password, 10);
          }
        },
      },
    }
  );

  Author.associate = function (models) {
    Author.hasMany(models.Post, { foreignKey: "author_id", as: "posts" });
  };

  Author.prototype.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  Author.prototype.generateToken = function () {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Token expires in 1 day
      }
    );
  };

  return Author;
};
