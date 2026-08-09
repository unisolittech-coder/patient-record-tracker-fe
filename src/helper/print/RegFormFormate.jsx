import logo from "../../assets/logo/Iggmc-Logo-PNG-400-X-400.webp";
import "./RegFormFormate.css";

function RegFormFormate({ values }) {
  const patientId = values?.patientId || "";
  const patientName = values?.patientName || "";
  const gender = values?.gender || "";
  const age = values?.age || "";
  const mobileNumber = values?.mobileNumber || "";
  const department = values?.department || "";
  const doctorName = values?.doctorName || "";
  const roomNumber = values?.roomNumber || "";
  const patientType = values?.patientType || "";
  const mlcType = values?.mlcType || "";
  const address = values?.address || "";
  const operatorName = values?.operatorName || "";
  const counterNumber = values?.counterNumber || "";
  const registrationDate = values?.registrationDate || "";
  const registrationTime = values?.registrationTime || "";

  return (
    <div className="reg-print-form">
      <div className="reg-print-card">
        {/* Header */}
        <div className="reg-print-header">
          <div className="reg-print-header-left">
            <h1 className="reg-print-header-title">
              Indira Gandhi Government Medical College
            </h1>
            <p className="reg-print-header-subtitle">& Hospital</p>
            <p className="reg-print-header-address">
              Mayo Hospital, CA Road, Mominpura, Nagpur - 440018
            </p>
            <p className="reg-print-header-address2">
              Nagpur (Urban), Nagpur, Maharashtra - 440018
            </p>
          </div>
          <div className="reg-print-logo">
            <img src={logo} alt="Hospital Logo" className="reg-print-logo-img" />
          </div>
        </div>

        {/* Patient ID & Doctor */}
        <div className="reg-print-patient-info-bar">
          <div className="reg-print-patient-id-label">
            रुग्ण ओळख क्रमांक (Patient ID):{" "}
            <span className="reg-print-patient-id-value">{patientId}</span>
          </div>
          <div className="reg-print-doctor-label">
            DR. Name: <span className="reg-print-doctor-value">{doctorName}</span>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="reg-print-quick-info-row">
          <span className="reg-print-room-label">
            खोली क्रमांक (Room):{" "}
            <span className="reg-print-room-value">
              {roomNumber ? `Room ${roomNumber}` : "-"}
            </span>
          </span>
          <span className="reg-print-counter-label">
            Counter Number:{" "}
            <span className="reg-print-counter-value">{counterNumber || "-"}</span>
          </span>
        </div>

        {/* Detailed Info Grid */}
        <div className="reg-print-detail-grid">
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">नाव (Name)</span>
            <span className="reg-print-info-value">{patientName || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">वय/लिंग (Age/Gender)</span>
            <span className="reg-print-info-value">{age && gender ? `${age} / ${gender}` : "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">मोबाईल क्रमांक (Mobile)</span>
            <span className="reg-print-info-value">{mobileNumber ? `+91 ${mobileNumber}` : "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">विभाग (Department)</span>
            <span className="reg-print-info-value">{department || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">नोंदणी दिनांक (Reg. Date)</span>
            <span className="reg-print-info-value">{registrationDate || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">नोंदणी वेळ (Reg. Time)</span>
            <span className="reg-print-info-value">{registrationTime || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">पत्ता (Address)</span>
            <span className="reg-print-info-value">{address || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">रुग्णाचा प्रकार (Patient Type)</span>
            <span className="reg-print-info-value">{patientType || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">MLC Patient</span>
            <span className="reg-print-info-value">{mlcType || "-"}</span>
          </div>
          <div className="reg-print-info-item">
            <span className="reg-print-info-label">Operator Name</span>
            <span className="reg-print-info-value">{operatorName || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegFormFormate;
