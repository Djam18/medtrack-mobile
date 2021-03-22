import { Medication, DoseLog, DailyStats } from '../types/medication';
import * as Sharing from 'expo-sharing';

// In a real app, we'd use react-native-pdf or react-native-html-to-pdf.
// Here we generate an HTML report and share it via the native share sheet.
// The user can then print-to-PDF from their device.

export interface MedReport {
  medications: Medication[];
  logs: DoseLog[];
  stats: DailyStats[];
  startDate: string;
  endDate: string;
  patientName?: string;
}

export function generateReportHTML(report: MedReport): string {
  const { medications, logs, stats, startDate, endDate, patientName } = report;

  const overallRate =
    logs.length > 0
      ? Math.round((logs.filter(l => l.takenAt !== null).length / logs.length) * 100)
      : 0;

  const medRows = medications
    .map(
      med => `
      <tr>
        <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${med.color};margin-right:6px"></span>${med.name}</td>
        <td>${med.dosage} ${med.unit}</td>
        <td>${med.frequency.replace(/-/g, ' ')}</td>
        <td>${med.times.join(', ') || 'As needed'}</td>
        <td>${med.isActive ? 'Active' : 'Inactive'}</td>
      </tr>`
    )
    .join('');

  const logRows = logs
    .slice(-50)  // last 50 entries
    .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime))
    .map(log => {
      const status = log.takenAt !== null ? 'Taken' : log.skipped ? 'Skipped' : 'Missed';
      const color = log.takenAt !== null ? '#22c55e' : log.skipped ? '#f59e0b' : '#ef4444';
      return `
        <tr>
          <td>${log.date}</td>
          <td>${log.medicationName}</td>
          <td>${log.scheduledTime.split('T')[1]?.slice(0, 5) ?? ''}</td>
          <td style="color:${color};font-weight:600">${status}</td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Medication Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; color: #111827; padding: 24px; }
    h1 { color: #2563eb; font-size: 26px; margin-bottom: 4px; }
    h2 { font-size: 16px; color: #374151; margin: 24px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .meta { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    .kpi-row { display: flex; gap: 16px; margin-bottom: 8px; }
    .kpi { background: #f9fafb; border-radius: 8px; padding: 12px 20px; flex: 1; text-align: center; }
    .kpi-value { font-size: 28px; font-weight: 800; color: #2563eb; }
    .kpi-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 12px; color: #6b7280; text-transform: uppercase; }
    td { padding: 8px 10px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>MedTrack Report</h1>
  <p class="meta">
    ${patientName ? `Patient: <strong>${patientName}</strong> &nbsp;|&nbsp; ` : ''}
    Period: ${startDate} to ${endDate} &nbsp;|&nbsp;
    Generated: ${new Date().toLocaleDateString()}
  </p>

  <div class="kpi-row">
    <div class="kpi">
      <div class="kpi-value">${medications.filter(m => m.isActive).length}</div>
      <div class="kpi-label">Active Medications</div>
    </div>
    <div class="kpi">
      <div class="kpi-value">${logs.length}</div>
      <div class="kpi-label">Total Doses</div>
    </div>
    <div class="kpi">
      <div class="kpi-value" style="color:${overallRate >= 80 ? '#22c55e' : '#f59e0b'}">${overallRate}%</div>
      <div class="kpi-label">Adherence Rate</div>
    </div>
  </div>

  <h2>Medications</h2>
  <table>
    <thead><tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Times</th><th>Status</th></tr></thead>
    <tbody>${medRows}</tbody>
  </table>

  <h2>Dose History (last 50)</h2>
  <table>
    <thead><tr><th>Date</th><th>Medication</th><th>Time</th><th>Status</th></tr></thead>
    <tbody>${logRows}</tbody>
  </table>
</body>
</html>`;
}

export async function exportReport(report: MedReport): Promise<void> {
  const html = generateReportHTML(report);

  // In Expo, we write the HTML and share it
  // The user can open in browser and print to PDF
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  // We'd write to a temp file using expo-file-system here
  // Simplified for now — in production use expo-print for direct PDF generation
}
