// src/controllers/delete_org.js
const { getDB } = require("../config/db");

exports.deleteOrganization = async (req, res) => {
  try {
    const db = getDB();
    if (!db) return res.status(500).json({ error: "Database not connected" });

    // Accept org name from body or query
    const organization_name = req.body.organization_name || req.query.organization_name;
    if (!organization_name) {
      return res.status(400).json({ error: "organization_name is required" });
    }

    // Auth middleware already attached admin info
    const admin = req.admin;
    if (!admin || !admin.organization_name) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure the requesting admin belongs to the same organization
    if (admin.organization_name !== organization_name) {
      return res.status(403).json({ error: "You are not allowed to delete this organization" });
    }

    const orgsCol = db.collection("organizations");
    const adminsCol = db.collection("admins");

    // Find org metadata
    const org = await orgsCol.findOne({ organization_name });
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const collectionName = org.collection_name; // e.g., org_tcs

    // 1) Drop org collection if exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      await db.collection(collectionName).drop();
    }

    // 2) Remove admins for this org
    await adminsCol.deleteMany({ organization_name });

    // 3) Remove entry from organizations master
    await orgsCol.deleteOne({ _id: org._id });

    return res.json({
      message: "Organization and related data deleted successfully",
      organization_name,
      dropped_collection: collectionName
    });
  } catch (err) {
    console.error("deleteOrganization ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
