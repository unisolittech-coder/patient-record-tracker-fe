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

  return (
    <div className="container blood-print-form">
      <div className="sticker">
        <div className="sticker-row">
          <div className="sticker-item">
            <div className="sticker-line" style={{ justifyContent: 'space-between', gap: '20px' }}>
              <span className="sticker-value" style={{ marginRight: '40px' }}>{printData.uniqueId || '-'}</span>
              <span className="sticker-value" style={{ textAlign: 'right' }}>{printData.dateTime || '-'}</span>
            </div>
            <div className="sticker-divider" />
          </div>
          <div className="sticker-item">
            <div className="sticker-line">
              <span className="sticker-value">{printData.testName || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}