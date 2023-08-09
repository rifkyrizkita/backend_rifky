const express = require("express");
const PORT = 8000;
const db = require("./models");
const cors = require("cors");
require("dotenv").config();
const server = express();
server.use(express.json());
server.use(express.static("./public"));
server.use(cors());
server.get("/", (req, res) => {
  res.status(200).send("This my API");
});
const { authRouters, employeeRouters } = require("./routers");
server.use("/auth", authRouters);
server.use("/employee", employeeRouters)
server.listen(PORT, () => {
 //db.sequelize.sync({alter:true})
  console.log(`Server running at port : ${PORT}`);
});
