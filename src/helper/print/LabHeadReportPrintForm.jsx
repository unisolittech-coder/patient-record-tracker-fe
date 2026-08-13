import { useMemo, useEffect } from "react";
import logo from "../../assets/logo/Iggmc-Logo-PNG-400-X-400.webp";
import styles from "./LabHeadReportPrintForm.module.css";

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (n) => String(n).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${year}${dateStr.includes("T") ? ` ${hours}:${minutes}` : ""}`;
}

function InfoItem({ label, value, wrapperClass, labelClass, valueClass }) {
  return (
    <div className={wrapperClass}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value || "-"}</span>
    </div>
  );
}

export default function LabHeadReportPrintForm({ report, images }) {
  const imageUrls = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map((img) => URL.createObjectURL(img));
  }, [images]);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  if (!report) return null;

  const data = report.data || {};
  const observations = data.observations || [];
  const age = data.age || data.patientAge || "";
  const gender = data.gender || "";
  const mobileNumber = data.mobileNumber || data.mobile || data.phone || "";
  const department = data.department || data.referToDepartment || "";
  const doctorName = data.doctorName || data.refDoctor || "";

  return (
    <div className={`lab-print-form ${styles.container}`}>
      <div className={styles.card}>
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

        <div className={styles.patientInfoBar}>
          <div className={styles.patientIdLabel}>
            रुग्ण ओळख क्रमांक (Patient ID): <span className={styles.patientIdValue}>{data.patientId || "-"}</span>
          </div>
          <div className={styles.reportIdLabel}>
            Report ID: <span className={styles.reportIdValue}>{data.uniqueId || "-"}</span>
          </div>
        </div>

        <div className={styles.reportTitleBar}>
          <h2 className={styles.reportTitle}>{report.reportType || "Lab Report"}</h2>
          <span className={styles.reportDate}>Date: {formatDateTime(data.date)}</span>
        </div>

        <div className={styles.patientDetailsGrid}>
          <InfoItem
            label="Patient Name"
            value={data.patientName}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="Age / Gender"
            value={age || gender ? `${age || "-"} / ${gender || "-"}` : "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="Mobile"
            value={mobileNumber ? `+91 ${mobileNumber}` : "-"}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="Department"
            value={department}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
          <InfoItem
            label="Doctor"
            value={doctorName}
            wrapperClass={styles.infoItem}
            labelClass={styles.infoLabel}
            valueClass={styles.infoValue}
          />
        </div>

        {observations.length > 0 && (
          <div className={styles.observationsSection}>
            <h3 className={styles.sectionTitle}>Test Results</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    <th className={styles.thParameter}>Parameter</th>
                    <th className={styles.thResult}>Result</th>
                    <th className={styles.thUnitRef}>Unit / Ref</th>
                    <th className={styles.thRange}>Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                      <td className={styles.tdParameter}>{obs.parameter}</td>
                      <td className={styles.tdResult}>{obs.result}</td>
                      <td className={styles.tdUnitRef}>{obs.unitRef}</td>
                      <td className={styles.tdRange}>{obs.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className={styles.observationsSection}>
            <h3 className={styles.sectionTitle}>Report Images</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Report image ${idx + 1}`}
                  className="max-w-full h-auto max-h-64 object-contain border border-gray-200 rounded-lg shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <p className={styles.signatureText}>Lab Technician / Pathologist</p>
            </div>
            <div className={styles.regardsBlock}>
              <p className={styles.regardsText}>Regards</p>
              <p className={styles.approvedText}>IGMC Approved</p>
            </div>
          </div>
          <div className={styles.footerNote}>
            <p>This is a computer-generated report. No signature is required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
