const router = require("express").Router()
const {employeeControllers} = require("../controllers")
const { verifyToken } = require("../middlewares/auth");
router.get("/", employeeControllers.getEmployee)
router.post("/clockIn", verifyToken,employeeControllers.clockIn)
router.patch("/clockOut", verifyToken,employeeControllers.clockOut)
router.get("/attendance", verifyToken,employeeControllers.todayAttendance)
router.get("/allAttendance", verifyToken,employeeControllers.attendance)

module.exports = router