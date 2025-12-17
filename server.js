const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = 3000;

/* ============ MIDDLEWARE ============ */
app.use(cors());
app.use(bodyParser.json());

// 🔥 IMPORTANT: serve frontend files
app.use(express.static(path.join(__dirname, "public")));

/* ============ TEMP DATABASE ============ */
let users = [];
let stuCounter = 1;

/* ============ REGISTER ============ */
app.post("/register", (req, res) => {
  const { fullname, stream, email, password } = req.body;

  if (!fullname || !stream || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = {
    _id: uuidv4(),                          // internal id
    userid: "STU" + String(stuCounter++).padStart(3, "0"),
    fullname,
    stream,
    email,
    password,                              // ⚠ demo only
    role: "Student",
    photo: ""
  };

  users.push(user);

  res.status(201).json({
    message: "Registration successful",
    user: {
      userid: user.userid,
      fullname: user.fullname,
      stream: user.stream,
      email: user.email,
      role: user.role
    }
  });
});

/* ============ LOGIN ============ */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user: {
      userid: user.userid,
      fullname: user.fullname,
      stream: user.stream,
      email: user.email,
      role: user.role,
      photo: user.photo
    }
  });
});

/* ============ DEFAULT ROUTE ============ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ============ START SERVER ============ */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
