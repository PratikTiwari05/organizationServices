Organization Management Service

A backend service built using Node.js + Express + MongoDB to manage organizations in a multi-tenant architecture.
Each organization dynamically gets its own MongoDB collection, while a Master Database stores global metadata and admin credentials.

**Features**

_1.Create Organization (dynamic collection creation)_

_2.Get Organization details_

_3.Update Organization name_

_4.Delete Organization (admin-auth protected)_

_5.Admin Login with JWT_

_6.Secure password hashing using bcrypt_

_7.Modular folder structure_


## Folder Structure

```
organization_services/
│── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── createOrganization.js
│   │   ├── getOrganization.js
│   │   ├── updateOrganization.js
│   │   ├── deleteOrganization.js
│   │   └── adminOrganization.js
│   ├── middleware/
│   │   └── authentication.js
│   ├── routes/
│   │   ├── create_org.js
│   │   ├── get_org.js
│   │   ├── update_org.js
│   │   ├── delete_org.js
│   │   └── admin_login.js
│── index.js
│── package.json
│── .gitignore
```



## High Level Architecture Diagram

```
                   +---------------------+
                   |     CLIENT (API)    |
                   +----------+----------+
                              |
                              v
                   +----------------------+
                   |    Express Server    |
                   |   (Route Handlers)   |
                   +----------+-----------+
                              |
        -------------------------------------------------
        |                       |                       |
        v                       v                       v
+------------------+   +------------------+    +---------------------------+
| organizations    |   | admins           |    | org_<organization_name>  |
| (Master DB)      |   | (Master DB)      |    | Dynamic Collection        |
+------------------+   +------------------+    +---------------------------+
```


1.Master DB stores:

@ Organization metadata

@ Admin credentials (hashed)

@ Collection mapping

2.Dynamic Collections store organization-specific data

3.JWT Authentication protects sensitive routes

 **Instructions to Run the Application**
1️. _Clone the repository_
git clone https://github.com/PratikTiwari05/organizationServices.git
cd organizationServices/organization_services

2️. _Install dependencies_
npm install

3️. _Create a .env file_
**(.env is ignored in GitHub)**

MONGO_URI=your local host
PORT=3000
JWT_SECRET= enter your own key

4️. _Start MongoDB_
Make sure MongoDB is running locally on port 27017.

5️. _Start the server_
node index.js

Server runs at:
**http://localhost:3000**

**Design Choices**
1️. Why Multi-Tenant Dynamic Collections?

Each organization gets a separate collection → ensures data isolation, scalability, and easy cleanup.
MongoDB’s schema-less design makes dynamic collection creation efficient.

2️. Why Master Database?

Central place to store:
Organizations
Admins
Collection mapping
Makes lookup & validation extremely fast.

3️. Why JWT Authentication?

Stateless auth → No session storage needed
Easy to include:
Admin ID
Organization name
Required for secured actions like deleting an organization.

4️. Why Express?

Lightweight
Easy routing

```
Developed by-
Pratik Tiwari
Email:pratik12122005@gmail.com
LinkedIn:https://www.linkedin.com/in/pratik-tiwari05/
```

