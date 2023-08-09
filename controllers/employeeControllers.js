const db = require("../models");
const employee = db.Employee;
const attendance = db.Attendance;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const transporter = require("../middlewares/transporter");
const fs = require("fs");
const handlebars = require("handlebars");
const timeOffset = 7 * 60 * 60 * 1000;
module.exports = {
  getEmployee: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const search = req.query.search;
      const cat_id = req.query.cat_id;
      const sort = req.query.sort || "DESC";
      const condition = { isDeleted: false, isSuspended: false };
      if (search) condition["fullName"] = { [Op.like]: `%${search}%` };
      const offset = (page - 1) * limit;
      const total = await employee.count({ where: condition });
      const result = await employee.findAll({
        attributes: { exclude: ["password"] },
        where: condition,
        order: [["fullName", sort]],
        limit,
        offset,
      });
      res.status(200).send({
        totalPage: Math.ceil(total / limit),
        currentPage: page,
        totalEmployee: total,
        result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  clockIn: async (req, res) => {
    try {
      const date = new Date();
      console.log(date);
      const indonesianTime = new Date(date.getTime() + timeOffset);
      console.log(indonesianTime);
      const checkClockIn = await attendance.findOne({
        where: {
          EmployeeId: req.user.id,
          clockedIn: {
            [Op.and]: {
              [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
              [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999)),
            },
          },
        },
      });
      if (!checkClockIn) {
        const result = await attendance.create({
          clockedIn: indonesianTime,
          EmployeeId: req.user.id,
        });
        res.status(200).send({
          message: "Clock-in successful",
          result,
        });
      } else {
        throw {
          message: "Already clocked in",
        };
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  clockOut: async (req, res) => {
    try {
      const date = new Date();
      console.log(date);
      const indonesianTime = new Date(date.getTime() + timeOffset);
      console.log(indonesianTime);
      const checkClockOut = await attendance.findOne({
        where: {
          EmployeeId: req.user.id,

          clockedOut: {
            [Op.and]: {
              [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
              [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999)),
            },
          },
        },
      });
      console.log(checkClockOut);
      if (checkClockOut == null) {
        const result = await attendance.update(
          {
            clockedOut: indonesianTime,
          },
          { where: { EmployeeId: req.user.id } }
        );
        res.status(200).send({
          message: "Clock-out successful",
          result,
        });
      } else {
        throw {
          message: "Already clocked out",
        };
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  todayAttendance: async (req, res) => {
    try {
      const sort = req.query.sort || "DESC";
      const result = await attendance.findAll({
        where: {
          EmployeeId: req.user.id,
          [Op.or]: [
            {
              clockedOut: {
                [Op.and]: {
                  [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
                  [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999)),
                },
              },
            },
            {
              clockedIn: {
                [Op.and]: {
                  [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
                  [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999)),
                },
              },
            },
          ],
        },
      });
      res.status(200).send({ result, status: true });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  attendance: async (req, res) => {
    try {
      const sort = req.query.sort || "DESC";
      const result = await attendance.findAll({
        where: {
          EmployeeId: req.user.id,
        },
        order: [["createdAt", sort]],
      });
      res.status(200).send({ result, status: true });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
