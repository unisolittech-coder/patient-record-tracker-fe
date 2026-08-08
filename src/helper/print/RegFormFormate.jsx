import logo from "../../assets/logo/Iggmc-Logo-PNG-400-X-400.webp";
import "./RegFormFormate.css";

function RegFormFormate() {
  return (
    <div className="reg-print-form">
      {/* ===== Header with Logo & Hospital Name ===== */}
      <div className="reg-print-header">
        <div className="header-text">
          <h1>Indira Gandhi Government Medical College</h1>
          <p className="subheading">& Hospital</p>
          <p className="address">
            Mayo Hospital, CA Road, Mominpura, Nagpur - 440018
          </p>
          <p className="address" style={{ color: "#6b7280" }}>
            Nagpur (Urban), Nagpur, Maharashtra - 440018
          </p>
        </div>
        <div className="logo-container">
          <img src={logo} alt="Hospital Logo" />
        </div>
      </div>

      {/* ===== Patient ID & Doctor (using reg-print-section) ===== */}
      <div
        className="reg-print-section"
        style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <div className="id-doctor-row">
          <div className="reg-print-field">
            <span>रुग्ण ओळख क्रमांक (Patient ID)</span>
            <strong>42434243242</strong>
          </div>
          <div className="reg-print-field" style={{ textAlign: "right" }}>
            <span>DR. Name</span>
            <strong>Dr. John Doe</strong>
          </div>
        </div>
      </div>

      {/* ===== Quick Info Row (Room, Doctor Days) ===== */}
      <div className="quick-info-row">
        <div>
          <span className="label">खोली क्रमांक (Room):</span>
          <span className="value">101</span>
        </div>
        <div>
          <span className="label">Doctor Days:</span>
          <span className="value">Monday, Wednesday, Friday</span>
        </div>
      </div>

      {/* ===== Detailed Patient Information ===== */}
      <div className="reg-print-section">
        <h2>Patient Details</h2>
        <div className="reg-print-grid">
          <div className="reg-print-field">
            <span>नाव (Name)</span>
            <strong>Mr. John Doe</strong>
          </div>
          <div className="reg-print-field">
            <span>वय/लिंग (Age/Gender)</span>
            <strong>30 / Male</strong>
          </div>
          <div className="reg-print-field">
            <span>मोबाईल क्रमांक (Mobile)</span>
            <strong>+91 9876543210</strong>
          </div>
          <div className="reg-print-field">
            <span>विभाग (Department)</span>
            <strong>General Medicine</strong>
          </div>
          <div className="reg-print-field">
            <span>नोंदणी दिनांक (Reg. Date)</span>
            <strong>2024-06-15</strong>
          </div>
          <div className="reg-print-field">
            <span>पत्ता (Address)</span>
            <strong>123 Main Street, Nagpur</strong>
          </div>
          <div className="reg-print-field">
            <span>रुग्णाचा प्रकार (Patient Type)</span>
            <strong>General</strong>
          </div>
          <div className="reg-print-field">
            <span>MLC Patient</span>
            <strong>No</strong>
          </div>
        </div>
      </div>

      {/* ===== Footer with signatures (optional, but adds completeness for printing) ===== */}
      <div className="reg-print-footer">
        <div>
          <p>Doctor's Signature</p>
          <div className="signature-line"></div>
        </div>
        <div>
          <p>Patient's / Guardian's Signature</p>
          <div className="signature-line"></div>
        </div>
      </div>
    </div>
  );
}

export default RegFormFormate;
