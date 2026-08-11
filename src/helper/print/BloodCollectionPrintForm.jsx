function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(-2);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

export default function BloodCollectionPrintForm({ printData }) {
  if (!printData) return null;

  const rows = [
    {
      label: 'Unique ID: ',
      value: printData.uniqueId || '-',
    },
    {
      label: 'Patient Name: ',
      value: printData.patientName || '-',
    },
    {
      label: 'Test Name: ',
      value: printData.testName || '-',
    },
    {
      label: '',
      value: printData.dateTime || '-',
    },
  ];

  return (
    <div className="container blood-print-form">
      <div className="sticker">
        <div className="sticker-row">
          {rows.map((row, idx) => (
            <div className="sticker-item" key={idx}>
              <div className="sticker-line">
                <span className="sticker-label">
                  {row.label}
                </span>

                <span className="sticker-value">
                  {row.value}
                </span>
              </div>

              {idx < rows.length - 1 && (
                <div className="sticker-divider" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}