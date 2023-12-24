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
// Verification of Token by The backend
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

/*
Login Route ("/login"):

This route handles a POST request to "/login".
It generates a JWT token using the jwt.sign method, which includes the user information (in this case, an example user with an ID, username, and email).
The token is then sent as a JSON response.

Profile Route ("/profile"):

This route is designed to handle a POST request to "/profile".
It is protected by the verifyToken middleware, which means that a valid token must be provided in the request headers for access.
Inside the route handler, it uses jwt.verify to verify the provided token using the secretKey.
If the token is valid, it responds with a JSON object containing a success message ("Profile Accessed") and the authenticated user data (authData).

Token Verification Middleware (verifyToken):
This middleware function (verifyToken) is used as a middleware in the "/profile" route.
It extracts the "authorization" header from the request, which typically contains the JWT token.
It sets req.token to the extracted token and calls next(), allowing the request to proceed to the next middleware or route handler.

secretKey is a variable used as the secret key for signing and verifying JSON Web Tokens (JWTs). It's essentially a shared secret known only to the server that is used to create and verify the authenticity of JWTs.

In the /profile route, the jwt.verify method is used to verify the received token, and secretKey is again provided as the second parameter for verification. If the verification is successful, the decoded information is available in the authData variable.

As for authData, it represents the decoded information stored in the JWT after it has been successfully verified.
*/
