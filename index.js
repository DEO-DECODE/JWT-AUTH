const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretKey";
app.get("/", (req, resp) => {
  resp.json({
    message: "A simple API",
  });
});
app.post("/login", (req, resp) => {
  const user = {
    id: 1,
    username: "Dev",
    email: "abc81@gamil.com",
  };
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});
// Verification of Taken by The backend
app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send({
        result: "Invalid Token",
      });
    } else {
      res.json({
        message: "Profile Accessed",
        authData,
      });
    }
  });
});
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
  
    if (typeof bearerHeader !== "undefined") {
      // Split the header value by space
      const bearer = bearerHeader.split(" ");
      
      if (bearer.length === 2) {
        // Get the token from the split array
        const token = bearer[1];
        req.token = token;
        next();
      } else {
        // If the token is not in the correct format
        res.status(403).json({
          message: "Invalid Token Format",
        });
      }
    } else {
      // If the "authorization" header is not present
      res.status(401).json({
        message: "Unauthorized: Token is missing",
      });
    } 
  }
  
app.listen(5000, () => {
  console.log("App is running on 5000 Port");
});
