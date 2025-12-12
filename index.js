console.log("index.js starting...");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", require("./src/routes/admin_login"));
app.use("/org", require("./src/routes/create_org"));
app.use("/org", require("./src/routes/get_org"));
app.use("/org", require("./src/routes/update_org"));
app.use("/org", require("./src/routes/delete_org"));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  console.log("DB connected successfully");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
