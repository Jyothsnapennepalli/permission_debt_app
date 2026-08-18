# 🔐 Permission Debt – Google Drive Access Risk Analyzer

Permission Debt is a web-based security auditing tool that helps users identify **over-shared, risky, and outdated access permissions** in their Google Drive.  
It visualizes **permission decay** by analyzing who has access to files, what level of access they have, and whether that access poses a security risk.

---

## 🚨 Problem Statement

Over time, Google Drive files accumulate **permission debt**:
- Files shared publicly by mistake
- External users retaining access indefinitely
- High-privilege roles (editors/owners) given unnecessarily

These issues increase the risk of **data leakage, compliance violations, and unauthorized access**, especially in collaborative environments.

---

## 💡 Solution Overview

Permission Debt provides:
- Secure Google authentication
- Automated permission scanning
- Risk classification (SAFE / MEDIUM / HIGH)
- A clean dashboard with summaries and metrics

The app **does not access file content**, only permission metadata.

---

## ✨ Key Features

- 🔐 Google OAuth Login
- 📂 Fetch Google Drive file metadata
- 👥 Analyze file-level permissions
- ⚠️ Detect risky access patterns
- 📊 Risk score and summary dashboard
- ☁️ Store audit results in Firestore
- 🚀 Fully deployable as a static web app

---

## 🧑‍💻 Tech Stack

### Frontend
- **React.js**
- **JavaScript (ES6+)**
- **CSS**

### Authentication & Backend Services
- **Firebase Authentication**
- **Firebase Firestore**

### Google APIs
- **Google Drive REST API**
- **OAuth 2.0**

### Deployment
- **GitHub Pages / Netlify / Vercel**

---

## 🧠 Google Technologies Used

- Google OAuth 2.0
- Google Drive API
- Firebase Authentication
- Firebase Firestore
- Google Cloud Console

---

## 🤖 Google AI Tools Integrated

> ⚠️ Note:  
This MVP focuses on **security analysis and access auditing**.  
AI-based recommendations and automated revocation are planned as future enhancements.

---

## 🏗️ System Architecture

```text
User
 │
 │  Login with Google
 ▼
Frontend (React)
 │
 │ OAuth Access Token
 ▼
Firebase Authentication
 │
 │ Secure API Calls
 ▼
Google Drive API
 │
 │ Permissions Metadata
 ▼
Risk Analysis Engine (Frontend)
 │
 │ Risk Scores & Reasons
 ▼
Firebase Firestore
 │
 │
 ▼
Dashboard UI
````

---

## 🔐 Authentication Flow

1. User clicks **Login with Google**
2. Firebase Authentication initiates OAuth
3. User grants Drive metadata access
4. App receives an **OAuth access token**
5. Token is used to call Google Drive APIs securely

---

## 📂 Google Drive Permissions Fetching Flow

1. Fetch list of Drive files:

   ```http
   GET /drive/v3/files
   ```

2. For each file, fetch permissions:

   ```http
   GET /drive/v3/files/{fileId}/permissions
   ```

3. Retrieved data:

   * Email address
   * Role (reader / writer / owner)
   * Type (user / domain / anyone)

---

## ⚠️ Risk Analysis Logic

Each permission is evaluated based on:

| Condition                 | Risk Reason         |
| ------------------------- | ------------------- |
| `type === anyone`         | Publicly accessible |
| External email            | External user       |
| `role === writer / owner` | High privilege      |

### Risk Levels

* 🟢 **SAFE** – Internal + read-only
* 🟠 **MEDIUM** – External OR high privilege
* 🔴 **HIGH** – Multiple risk factors

---

## 📊 Risk Score Calculation

* HIGH risk → +10 points
* MEDIUM risk → +5 points
* Score capped at **100**

This gives users a quick snapshot of their Drive security posture.

---

## 🗂️ Data Storage

Audit results are stored in:

```text
Firestore
└── users
    └── {userId}
        └── permissions
```

Each record includes:

* File name
* Email
* Role
* Risk level
* Risk reasons
* Timestamp

---

## 🚀 Deployment

This project can be deployed as a **static web app** using:

* GitHub Pages
* Netlify
* Vercel

Steps:

1. Build the React app
2. Connect repository to hosting platform
3. Add Firebase config & OAuth redirect URLs
4. Deploy

---

## 🎥 Demo Video

The demo showcases:

1. Project overview
2. Google login flow
3. Permission scanning
4. Risk dashboard
5. Real-time analysis results

---

## 🔮 Future Enhancements

* AI-based permission cleanup recommendations
* Auto-revoke risky permissions
* Organization-wide Drive scanning
* Admin dashboards
* Scheduled audits

---

## 🏷️ Project Domain

* ✅ Web Development
* ✅ App Development
* 🔐 Security & Privacy
* 📊 Cloud Access Governance

---

## 👨‍💼 Use Cases

* Individual users
* Startups
* Enterprises
* Compliance audits
* Security reviews

---

## 📜 License

This project is for educational and hackathon purposes.

---

## 🙌 Acknowledgements

* Google Drive API
* Firebase
* Google Cloud Platform
* Open-source community

