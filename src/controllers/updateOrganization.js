// src/controllers/update_org.js
const { getDB } = require("../config/db");

exports.updateOrganization = async (req, res) => {
  try {
    const db = getDB();
    const { organization_name, new_organization_name } = req.body;

    // 1. Validate inputs
    if (!organization_name || !new_organization_name) {
      return res.status(400).json({
        error: "organization_name and new_organization_name are required",
      });
    }

    const orgs = db.collection("organizations");

    // 2. Find old organization
    const oldOrg = await orgs.findOne({ organization_name });
    if (!oldOrg) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // 3. Ensure new name not already taken
    const nameExists = await orgs.findOne({ organization_name: new_organization_name });
    if (nameExists) {
      return res.status(409).json({ error: "New organization name already exists" });
    }

    // 4. Collection names
    const oldCollection = oldOrg.collection_name;               // e.g. org_tcs
    const newCollection = "org_" + new_organization_name;       // e.g. org_tcs_global

    // 5. Create new collection (ignore error if exists)
    try {
      await db.createCollection(newCollection);
    } catch (err) {
      // ignore if already exists
    }

    // 6. Copy data from old -> new
    const oldColRef = db.collection(oldCollection);
    const newColRef = db.collection(newCollection);

    const oldDocs = await oldColRef.find({}).toArray();
    if (oldDocs.length > 0) {
      await newColRef.insertMany(oldDocs);
    }

    // 7. Update master metadata
    await orgs.updateOne(
      { _id: oldOrg._id },
      {
        $set: {
          organization_name: new_organization_name,
          collection_name: newCollection,
          updated_at: new Date(),
        },
      }
    );

    return res.json({
      message: "Organization updated successfully",
      old_name: organization_name,
      new_name: new_organization_name,
      old_collection: oldCollection,
      new_collection: newCollection,
    });
  } catch (err) {
    console.error("updateOrganization ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
