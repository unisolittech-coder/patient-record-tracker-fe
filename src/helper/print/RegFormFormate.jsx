import logo from "../../assets/logo/Iggmc-Logo-PNG-400-X-400.webp";
import styles from "./RegFormFormate.module.css";
function RegFormFormate({ values }) {
  const patientId = values?.patientId || "";
  const patientName = values?.patientName || "";
  const gender = values?.gender || "";
  const age = values?.age || "";
  const mobileNumber = values?.mobileNumber || "";
  const department = values?.referToDepartment || values?.department || "";
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
    <div className={`reg-print-form ${styles.container}`}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>
              Indira Gandhi Government Medical College
            </h1>
            <p className={styles.headerSubtitle}>& Hospital</p>
            <p className={styles.headerAddress}>
              Mayo Hospital, CA Road, Mominpura, Nagpur - 440018
            </p>
            <p className={styles.headerAddress2}>
              Nagpur (Urban), Nagpur, Maharashtra - 440018
            </p>
          </div>
          <div className={styles.logoPlaceholder}>
            <img src={logo} alt="Hospital Logo" className={styles.logoImg} />
          </div>
        </div>

        {/* Patient ID & Doctor */}
        <div className={styles.patientInfoBar}>
          <div className={styles.patientIdLabel}>
            रुग्ण ओळख क्रमांक (Patient ID):{" "}
            <span className={styles.patientIdValue}>{patientId}</span>
          </div>
          <div className={styles.doctorLabel}>
            DR. Name: <span className={styles.doctorValue}>{doctorName}</span>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className={styles.quickInfoRow}>
          <span className={styles.roomLabel}>
            खोली क्रमांक (Room):{" "}
            <span className={styles.roomValue}>
              {roomNumber ? `Room ${roomNumber}` : "-"}
            </span>
          </span>
          <span className={styles.counterLabel}>
            Counter Number:{" "}
            <span className={styles.counterValue}>{counterNumber || "-"}</span>
          </span>
        </div>

        {/* Detailed Info Grid */}
        <div className={styles.detailGrid}>
          <InfoItem
            label="नाव (Name)"
            value={patientName || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="वय/लिंग (Age/Gender)"
            value={age && gender ? `${age} / ${gender}` : "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="मोबाईल क्रमांक (Mobile)"
            value={mobileNumber ? `+91 ${mobileNumber}` : "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="विभाग (Department)"
            value={department || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="नोंदणी दिनांक (Reg. Date)"
            value={registrationDate || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="नोंदणी वेळ (Reg. Time)"
            value={registrationTime || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="पत्ता (Address)"
            value={address || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="रुग्णाचा प्रकार (Patient Type)"
            value={patientType || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="MLC Patient"
            value={mlcType || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="Operator Name"
            value={operatorName || "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Helper component ----------
function InfoItem({ label, value, wrapperClass, labelClass, valueClass }) {
  return (
    <div className={wrapperClass}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default RegFormFormate;
