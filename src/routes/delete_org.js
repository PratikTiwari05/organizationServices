// src/routes/delete_org.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const { deleteOrganization } = require("../controllers/deleteOrganization");

// ensure auth and controller are functions before using them
if (typeof auth !== "function") {
  throw new Error("Auth middleware is not a function. Check src/middleware/auth.js export.");
}
if (typeof deleteOrganization !== "function") {
  throw new Error("deleteOrganization handler is not a function. Check src/controllers/delete_org.js export.");
}

router.delete("/delete", auth, deleteOrganization);

module.exports = router;
