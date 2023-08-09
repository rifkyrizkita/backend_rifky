const db = require("../models");
const employee = db.Employee;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const transporter = require("../middlewares/transporter");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = {
  addEmployee: async (req, res) => {
    try {
      const { email } = req.body;
      const isAccountExist = await employee.findOne({
        where: { id: req.user.id },
      });
      if (!isAccountExist.isAdmin)
        throw { message: "Only admin can add new cashier" };
      const result = await employee.create({
        email,
      });
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1d" });
      const data = await fs.readFileSync(
        "./templates/templateRegister.html",
        "utf-8"
      );
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ token });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: email,
        subject: "Register",
        html: tempResult,
      });
      res.status(200).send({
        status: true,
        message: "Add new employee success",
        result,
        token,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  register: async (req, res) => {
    try {
      const { fullName, password, phoneNumber, address, birthDate } = req.body;
      const isAccountExist = await employee.findOne({
        where: { id: req.user.id },
      });
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const result = await employee.update(
        {
          fullName,
          phoneNumber,
          address,
          birthDate,
          password: hashPassword,
        },
        { where: { id: isAccountExist.id } }
      );
      res.status(200).send({
        status: true,
        message: "Register success",
        result,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { fullName, phoneNumber, address, birthDate } = req.body;
      const isAccountExist = await employee.findOne({
        where: { id: req.user.id },
      });
      const result = await employee.update(
        {
          fullName,
          phoneNumber,
          address,
          birthDate,
        },
        { where: { id: isAccountExist.id } }
      );
      res.status(200).send({
        status: true,
        message: "Update success",
        result,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await employee.findOne({ where: { email } });
      if (result == null) throw { message: "Account not found" };
      const isValid = await bcrypt.compare(password, result.password);
      if (!isValid) throw { message: "Wrong password" };
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1d" });
      res.status(200).send({
        status: true,
        message: "Login success",
        result,
        token,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  keepLogin: async (req, res) => {
    try {
      const result = await employee.findOne({
        where: {
          id: req.user.id,
        },
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  uploadPicture: async (req, res) => {
    try {
      if (req.file == undefined) {
        throw { message: "Image should not be empty" };
      }
      const result = await employee.update(
        { imgProfile: req.file.filename },
        { where: { id: req.user.id } }
      );
      res.status(200).send({ result, message: "Upload success" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
};
