const Joi = require("joi");
const superUserValidationSchema = {
  // Joi schema for super user creation
  registerSchema: Joi.object({
    first_name: Joi.string().required().messages({
      "any.required": "First name is required.",
      "string.empty": "First name must not be empty.",
      "string.base": "First name must be a string.",
    }),
    last_name: Joi.string().required().messages({
      "any.required": "Last name is required.",
      "string.empty": "Last name must not be empty.",
      "string.base": "Last name must be a string.",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Email is required.",
      "string.empty": "Email must not be empty.",
      "string.email": "Email must be a valid email address.",
    }),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    company_name: Joi.string().required(),
    company_reg_no: Joi.string().required(),
  }),

  // Joi schema for super user update
  updateSuperUserSchema: Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    company_reg_no: Joi.string().required(),
    company_name: Joi.string().required(),
  }),

  // Joi schema for delete User
  deleteSuperUserSchema: Joi.object({
    id: Joi.number().required(),
  }),

  // Joi schema for forgot password
  forgotPasswordSchema: Joi.object({
    email: Joi.string().email().required(),
  }),

  // Joi schema for reset password
  resetPasswordSchema: Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = superUserValidationSchema;
