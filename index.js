const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const SECRET_KEY = "supersecretadmin";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    console.log(token);
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(402).json({ message: "Invalid token" });
  }
};

app.post("/admin/login", (req, res) => {
  const { secret } = req.body;

  if (secret === SECRET_KEY) {
    const token = jwt.sign(
      {
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } else {
    res.json({ message: "Invalid secret" });
  }
});

app.get("/admin/api/data", verifyToken, (req, res) => {
  res.json({ message: "Protected route accessible" });
});

app.listen(3000, () => console.log("Server is running on 3000"));
