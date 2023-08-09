const jwt = require("jsonwebtoken")
module.exports= {
    verifyToken: (req, res, next) => {
        try {
          let token = req.headers.authorization;
          if (!token) throw { message: "Token is empty" };
          token = token.split(" ")[1];
          let verifiedUser = jwt.verify(token, process.env.KEY_JWT);
          console.log(verifiedUser);
          req.user = verifiedUser;
          req.token = token
          next();
        } catch (error) {
          res.status(400).send(error);
        }
      },
}