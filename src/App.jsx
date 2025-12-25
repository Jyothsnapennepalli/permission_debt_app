import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import { ShieldCheck, LogIn } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // ✅ NEW (landing page)

  const provider = new GoogleAuthProvider();
  provider.addScope(
    "https://www.googleapis.com/auth/drive.metadata.readonly"
  );

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential =
        GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      setUser({
        ...result.user,
        accessToken: token,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setPermissions([]);
    setShowLogin(false);
  };

  const fetchDriveFiles = async () => {
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name)",
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.files || [];
  };

  const fetchPermissions = async (fileId) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?fields=permissions(emailAddress,role,type)`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.permissions || [];
  };

  const analyzeRisk = (permission, userEmail) => {
    const reasons = [];
    const userDomain = userEmail.split("@")[1];

    if (permission.type === "anyone")
      reasons.push("Publicly accessible");
    if (
      permission.email &&
      !permission.email.endsWith(userDomain)
    )
      reasons.push("External user");
    if (
      permission.role === "writer" ||
      permission.role === "owner"
    )
      reasons.push("High privilege access");

    let riskLevel = "SAFE";
    if (reasons.length === 1) riskLevel = "MEDIUM";
    if (reasons.length >= 2) riskLevel = "HIGH";

    return { riskLevel, reasons };
  };

  const calculateRiskScore = () => {
    if (permissions.length === 0) return 0;
    let score = 0;
    permissions.forEach((p) => {
      if (p.riskLevel === "HIGH") score += 10;
      if (p.riskLevel === "MEDIUM") score += 5;
    });
    return Math.min(100, score);
  };

  const loadPermissions = async () => {
    setLoading(true);
    setPermissions([]);

    const files = await fetchDriveFiles();
    const results = [];

    for (const file of files) {
      const filePermissions = await fetchPermissions(file.id);

      for (const p of filePermissions) {
        const risk = analyzeRisk(
          {
            email: p.emailAddress,
            role: p.role,
            type: p.type,
          },
          user.email
        );

        const record = {
          fileName: file.name,
          email: p.emailAddress || "N/A",
          role: p.role,
          type: p.type,
          riskLevel: risk.riskLevel,
          riskReasons: risk.reasons,
          timestamp: new Date(),
        };

        await addDoc(
          collection(db, "users", user.uid, "permissions"),
          record
        );

        results.push(record);
      }
    }

    setPermissions(results);
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <div className="animated-bg"></div>

      <div className="app-container fade-in">
        <ShieldCheck className="header-icon" />
        <h1>Permission Debt</h1>
        <p className="subtitle">Digital Consent & Access Decay</p>

        {/* 🔹 LANDING PAGE */}
        {!user && !showLogin && (
          <>
            <p style={{ marginTop: "16px", fontSize: "14px", lineHeight: "1.6" }}>
              Over time, files in Google Drive accumulate excessive permissions —
              external users, public links, and high-privilege access.
              <br /><br />
              <strong>Permission Debt</strong> helps you detect risky access,
              quantify exposure, and regain control of your data.
            </p>

            <button
              className="google-btn"
              style={{ marginTop: "24px" }}
              onClick={() => setShowLogin(true)}
            >
              Get Started
            </button>
          </>
        )}

        {/* 🔹 LOGIN */}
        {!user && showLogin && (
          <button className="google-btn" onClick={login}>
            <LogIn size={18} />
            Login with Google
          </button>
        )}

        {/* 🔹 DASHBOARD */}
        {user && (
          <>
            {permissions.length > 0 && (
              <>
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="summary-card">
                    <h3>Total Access</h3>
                    <p>{permissions.length}</p>
                  </div>
                  <div className="summary-card high">
                    <h3>High Risk</h3>
                    <p>{permissions.filter(p => p.riskLevel === "HIGH").length}</p>
                  </div>
                  <div className="summary-card medium">
                    <h3>External Users</h3>
                    <p>{permissions.filter(p => p.riskReasons.includes("External user")).length}</p>
                  </div>
                </div>

                <div style={{ fontWeight: 600, marginBottom: "8px" }}>
                  🔐 Drive Risk Score: {calculateRiskScore()} / 100
                </div>
              </>
            )}

            <div className="user-info">
              <img className="avatar" src={user.photoURL} alt="profile" />
              <div className="user-name">{user.displayName}</div>
              <div className="user-email">{user.email}</div>
            </div>

            {!loading && permissions.length === 0 && (
              <button className="google-btn" onClick={loadPermissions}>
                Load Drive Permissions
              </button>
            )}

            {loading && (
              <div className="loader-container">
                <div className="spinner"></div>
                <p>Analyzing Drive permissions…</p>
              </div>
            )}

            {permissions.length > 0 && (
              <div className="table-wrapper">
                <table className="permissions-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Risk</th>
                      <th>Reasons</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((p, index) => (
                      <tr key={index}>
                        <td>{p.fileName}</td>
                        <td>{p.email}</td>
                        <td>{p.role}</td>
                        <td>{p.type}</td>
                        <td>{p.riskLevel}</td>
                        <td>{p.riskReasons.join(", ")}</td>
                        <td>
                          <button disabled>Revoke (Soon)</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
