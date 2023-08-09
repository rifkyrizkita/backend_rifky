const router = require("express").Router();
const { authControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");
const{ checkAddEmployee, checkRegister, checkLogin } = require("../middlewares/validator")

router.post("/addEmployee", verifyToken, checkAddEmployee,authControllers.addEmployee);
router.post("/register", verifyToken,checkRegister ,authControllers.register);
router.patch("/updateProfile", verifyToken ,authControllers.updateProfile);
router.post("/login", checkLogin,authControllers.login);
router.get("/keepLogin", verifyToken, authControllers.keepLogin);
router.post(
  "/profilePicture",
  verifyToken,
  multerUpload().single("file"),
  authControllers.uploadPicture
);

module.exports = router;
