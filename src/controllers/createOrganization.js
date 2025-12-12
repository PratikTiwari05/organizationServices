const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");

exports.createOrganization = async (req, res) => {
  try {
    const db = getDB();

    const { organization_name, email, password } = req.body;

    // Check if  details are missing
    if (!organization_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const orgs = db.collection("organizations");
    const admins = db.collection("admins");

    // check if org already exists
    const exists = await orgs.findOne({ organization_name });
    if (exists) {
      return res.status(400).json({ error: "Organization already exists" });
    }

    // create dynamic collection 
    const collectionName = "org_" + organization_name.toLowerCase();
    await db.createCollection(collectionName).catch(() => {});

    // hash admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const admin = await admins.insertOne({
      email,
      password: hashedPassword,
      organization_name,
      created_at: new Date()
    });

    // store organization metadata
    const org = await orgs.insertOne({
      organization_name,
      collection_name: collectionName,
      admin_id: admin.insertedId,
      created_at: new Date()
    });

    return res.status(201).json({
      message: "Organization created successfully",
      organization_id: org.insertedId,
      collection: collectionName
    });

  } catch (err) {
    console.log("Error creating org:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
