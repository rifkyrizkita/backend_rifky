const { body, validationResult } = require("express-validator");
const fs = require("fs");

module.exports = {
  checkAddEmployee: async (req, res, next) => {
    try {
      await body("email")
        .notEmpty()
        .withMessage("Email must not be empty")
        .isEmail()
        .withMessage("Invalid email format")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkRegister: async (req, res, next) => {
    try {
      await body("fullName")
        .notEmpty()
        .withMessage("Name must not be empty")
        .run(req);
      await body("phoneNumber")
        .notEmpty()
        .withMessage("Phone number but not be empty")
        .isMobilePhone()
        .withMessage("Invalid phnoe number format")
        .run(req);
      await body("address")
        .notEmpty()
        .withMessage("Address must not be empty")
        .run(req);
      await body("birthDate")
        .notEmpty()
        .withMessage("Birth date must not be empty")
        .isDate()
        .withMessage("Invalid date format")
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("Password must not be empty")
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      await body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password must not be empty")
        .equals(req.body.password)
        .withMessage("Passwords do not match")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkLogin: async (req, res, next) => {
    try {
      await body("email")
        .notEmpty()
        .withMessage("Email must not be empty")
        .isEmail()
        .withMessage("Invalid email format")
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("Password must not be empty")
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
        console.log(error);
    }
  },
};
