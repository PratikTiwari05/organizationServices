const express=require("express");
const router=express.Router();
const {updateOrganization}=require("../controllers/updateOrganization");

router.put("/update", updateOrganization);
module.exports=router;