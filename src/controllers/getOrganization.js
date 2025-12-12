const { getDB } = require("../config/db");

exports.getOrganization = async (req, res) => {
  try {
    const db = getDB();
    const organization_name = req.query.organization_name;

    if (!organization_name) {
      return res.status(400).json({ error: "organization_name is required" });
    }

    const org = await db.collection("organizations").findOne({ organization_name });

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    return res.json(org);
  } catch (err) {
    console.error("GET ORG ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
