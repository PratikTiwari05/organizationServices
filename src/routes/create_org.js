const express = require('express');
const router = express.Router();
const { createOrganization } = require("../controllers/createOrganization"); //passed to controller for the functionalities
//POST Route for Create organization
router.post("/create",createOrganization);
module.exports=router;