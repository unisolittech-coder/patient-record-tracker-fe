import { useMemo, useEffect, useState } from "react";
import logo from "../../assets/logo/Iggmc-Logo-PNG-400-X-400.webp";
import styles from "./LabHeadReportPrintForm.module.css";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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
  return `${day}/${month}/${year}${
    dateStr.includes("T") ? ` ${hours}:${minutes}` : ""
  }`;
}

/** Accepts URL, data-uri, blob or raw base64 and returns a usable <img src>. */
function normalizeSignature(value) {
  if (!value || typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  if (/^data:image\//i.test(v)) return v;
  if (/^(https?:\/\/|blob:)/i.test(v) || v.startsWith("/")) return v;
  if (v.length > 100 && /^[A-Za-z0-9+/=\s]+$/.test(v)) {
    return `data:image/png;base64,${v.replace(/\s+/g, "")}`;
  }
  return "";
}

/**
 * Reads the technical / departmental signed-in user from sessionStorage.
 *
 * Your login hook stores these SEPARATE keys:
 *   - sessionStorage.name        → full name of the signer
 *   - sessionStorage.role        → role of the signer
 *   - sessionStorage.signedInUser → the signature only (URL / base64)
 *
 * This reader also supports a JSON shape (in case someone changes the
 * hook later to store a full object) so it stays future-proof.
 */
function readSignedInUser() {
  const empty = { name: "", role: "", signature: "" };
  if (typeof window === "undefined") return empty;

  const safeGet = (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  /* ---- 1) Read the three keys your login already populates ---- */
  const rawName = safeGet("name") || "";
  const rawRole = safeGet("role") || "";
  const rawSign = safeGet("signedInUser") || "";

  /* If `signedInUser` is a JSON object (future-proof fallback),
     pull everything from it. Otherwise treat it as a raw signature. */
  let parsed = null;
  if (rawSign) {
    try {
      parsed = JSON.parse(rawSign);
    } catch {
      parsed = null;
    }
  }

  if (parsed && typeof parsed === "object") {
    const u =
      parsed.user && typeof parsed.user === "object" ? parsed.user : parsed;
    const pickStr = (...keys) => {
      for (const k of keys) {
        const v = u?.[k];
        if (typeof v === "string" && v.trim()) return v.trim();
      }
      return "";
    };
    return {
      name:
        pickStr("name", "fullName", "full_name", "username", "userName") ||
        rawName,
      role: pickStr("role", "userRole", "designation") || rawRole,
      signature: normalizeSignature(
        pickStr(
          "signature",
          "sign",
          "signatureUrl",
          "signatureURL",
          "signImage",
          "signatureImage",
          "digitalSignature"
        )
      ),
    };
  }

  /* ---- 2) Classic layout: signedInUser = raw signature ---- */
  return {
    name: rawName,
    role: rawRole,
    signature: normalizeSignature(rawSign),
  };
}

/* ------------------------------------------------------------------ */
/* Small presentational bits                                           */
/* ------------------------------------------------------------------ */

function Detail({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value || "—"}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

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

  const [signedInUser] = useState(() => readSignedInUser());

  if (!report) return null;

  const data = report.data || {};
  const observations = data.observations || [];
  const isManualType = report.reportType === "Manual Type";

  return (
    <div className={`lab-print-form ${styles.container}`}>
      <table className={styles.layoutTable}>
        {/* ============================================================== */}
        {/* HEADER — repeats at the top of EVERY printed page              */}
        {/* ============================================================== */}
        <thead>
          <tr>
            <td className={styles.layoutCell}>
              <div className={styles.pageHeader}>
                <div className={styles.headerTop}>
                  <div className={styles.headerLogo}>
                    <img src={logo} alt="Hospital Logo" />
                  </div>
                  <div className={styles.headerText}>
                    <h1>
                      Indira Gandhi Government Medical College &amp; Hospital
                    </h1>
                    <p className={styles.headerSub}>
                      Mayo Hospital, CA Road, Mominpura, Nagpur – 440018
                    </p>
                    <p className={styles.headerSub}>
                      Nagpur (Urban), Nagpur, Maharashtra – 440018
                    </p>
                  </div>
                  <div className={styles.headerLogoSpacer} aria-hidden="true" />
                </div>
                <div className={styles.headerStrip}>
                  <span>Laboratory Report</span>
                  <span>गोपनीय / Confidential</span>
                </div>
              </div>
            </td>
          </tr>
        </thead>

        {/* ============================================================== */}
        {/* BODY — flows naturally across pages                            */}
        {/* ============================================================== */}
        <tbody>
          <tr>
            <td className={styles.layoutCell}>
              <div className={styles.pageBody}>
                {/* ---------- ID bar ---------- */}
                <div className={styles.idBar}>
                  <div className={styles.idItem}>
                    <span className={styles.idLabel}>
                      Patient ID / रुग्ण ओळख क्रमांक
                    </span>
                    <span className={styles.idValue}>{data.UHID || "—"}</span>
                  </div>
                  <div className={styles.idItem}>
                    <span className={styles.idLabel}>Report ID</span>
                    <span className={styles.idValue}>
                      {data.uniqueId || data.UHID || "—"}
                    </span>
                  </div>
                  <div className={styles.idItem}>
                    <span className={styles.idLabel}>Report Date</span>
                    <span className={styles.idValue}>
                      {formatDateTime(data.date)}
                    </span>
                  </div>
                </div>

                {/* ---------- Patient info ---------- */}
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionHeaderText}>
                      Patient Information
                    </span>
                  </div>
                  <div className={styles.detailsGrid}>
                    <Detail label="Patient Name" value={data.patientName} />
                    <Detail
                      label="Mobile"
                      value={
                        data.mobileNumber || data.mobile || data.phone
                          ? `+91 ${
                              data.mobileNumber || data.mobile || data.phone
                            }`
                          : ""
                      }
                    />
                    <Detail
                      label="Age"
                      value={data.age || data.patientAge || ""}
                    />
                    <Detail label="Gender" value={data.gender} />
                    <Detail
                      label="Department"
                      value={data.department || data.referToDepartment}
                    />
                    <Detail
                      label="Referring Doctor"
                      value={data.doctorName || data.refDoctor}
                    />
                  </div>
                </section>

                {/* ---------- Results ---------- */}
                <section className={styles.section}>
                  <div className={styles.reportTitle}>
                    <span>{report.reportType || "Lab Report"}</span>
                  </div>

                  {observations.length > 0 ? (
                    <div className={styles.tableWrap}>
                      <table className={styles.resultsTable}>
                        <thead>
                          <tr>
                            <th style={{ width: "6%" }}>#</th>
                            <th style={{ width: "32%" }}>Parameter</th>
                            <th style={{ width: "28%" }}>Result</th>
                            <th style={{ width: "17%" }}>Unit / Ref</th>
                            <th style={{ width: "17%" }}>Reference Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {observations.map((obs, idx) => {
                            const isImageUrl =
                              isManualType &&
                              typeof obs.result === "string" &&
                              /^https?:\/\//.test(obs.result);
                            return (
                              <tr key={idx}>
                                <td className={styles.tdIndex}>{idx + 1}</td>
                                <td className={styles.tdParameter}>
                                  {obs.parameter}
                                </td>
                                <td className={styles.tdResult}>
                                  {isImageUrl ? (
                                    <img
                                      src={obs.result}
                                      alt={obs.parameter}
                                      className={styles.obsImage}
                                    />
                                  ) : (
                                    obs.result || "—"
                                  )}
                                </td>
                                <td className={styles.tdUnit}>
                                  {obs.unitRef || "—"}
                                </td>
                                <td className={styles.tdRange}>
                                  {obs.range || "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.noData}>
                      No observations available for this report.
                    </p>
                  )}
                </section>

                {/* ---------- Extra captured images ---------- */}
                {imageUrls.length > 0 && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionHeaderText}>
                        Report Images
                      </span>
                    </div>
                    <div className={styles.imagesRow}>
                      {imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Report image ${idx + 1}`}
                          className={styles.reportImage}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* ---------- End marker ---------- */}
                <div className={styles.endMarker}>— End of Report —</div>

                {/* ---------- Signature (only at the end of the report) ---------- */}
                <div className={styles.signatureSection}>
                  <div className={styles.signatureBlock}>
                    {signedInUser.signature ? (
                      <img
                        src={signedInUser.signature}
                        alt="Signature"
                        className={styles.signatureImg}
                      />
                    ) : (
                      <div className={styles.signatureImgPlaceholder} />
                    )}
                    <div className={styles.signatureLine} />
                    <p className={styles.signatureName}>
                      {signedInUser.name || "Lab Technician / Pathologist"}
                    </p>
                    {signedInUser.role ? (
                      <p className={styles.signatureRole}>
                        {signedInUser.role}
                      </p>
                    ) : null}
                    <p className={styles.signatureRole}>IGGMC Approved</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        {/* ============================================================== */}
        {/* FOOTER — repeats at the bottom of EVERY printed page           */}
        {/* ============================================================== */}
        <tfoot>
          <tr>
            <td className={styles.layoutCell}>
              <div className={styles.pageFooter}>
                <div className={styles.footerLeft}>
                  <p className={styles.footerNote}>
                    This is a computer-generated report. No signature is
                    required.
                  </p>
                </div>
                <div className={styles.footerRight}>
                  <span className={styles.footerBrand}>IGGMC</span>
                  <span className={styles.footerTag}>
                    Approved Laboratory Report
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}