// src/routes/get_org.js
const express = require("express");
const router = express.Router();
const { getOrganization } = require("../controllers/getOrganization");


router.get("/get", getOrganization);

module.exports = router;
