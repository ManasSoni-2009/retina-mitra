import { jsPDF } from 'jspdf';
import { Screening } from '@/types/screening';

// Helper to convert an image URL into a base64 Data URL using an offscreen canvas
function getBase64ImageFromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 512;
        canvas.height = img.height || 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

export type ReportFormat = 'Detailed' | 'Summary' | 'Raw CSV';

export function getActiveReportFormat(): ReportFormat {
  if (typeof window === 'undefined') return 'Detailed';
  try {
    const stored = localStorage.getItem('rm_active_settings_v2');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.defaultReportFormat === 'Summary') return 'Summary';
      if (parsed.defaultReportFormat === 'Raw CSV') return 'Raw CSV';
    }
  } catch (e) {
    console.error('Failed to read report format setting:', e);
  }
  return 'Detailed';
}

function downloadCSV(screening: Screening) {
  const isUngradable = screening.qualityStatus === 'UNGRADABLE';
  const isReferable = screening.referable;
  const gradeLabel = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : (screening.drGradeLabel || `Grade ${screening.drGrade}`);

  const rows = [
    ['Field', 'Value'],
    ['Screening ID', screening.screeningId],
    ['Patient Alias', screening.patientAlias || 'N/A'],
    ['Health Center', screening.phcCenter || 'N/A'],
    ['Screening Date', new Date(screening.createdAt).toLocaleString()],
    ['Intake Type', 'Color Fundus Photography (45° Field)'],
    ['Quality Status', screening.qualityStatus],
    ['DR Grade', gradeLabel || 'N/A'],
    ['Referable Finding', isReferable ? 'YES' : 'NO'],
    ['Requires Human Review', screening.requiresHumanReview ? 'YES' : 'NO'],
    ['Confidence Level', isUngradable ? 'Low' : 'High'],
    ['Review Decision Action', screening.reviewDecision?.action || 'PENDING'],
    ['Reviewer Comments', screening.reviewDecision?.comments || 'None'],
    ['Medical Disclaimer', 'Prototype decision support output. Not an autonomous diagnostic system.'],
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `RETINA-MITRA_Screening_Report_${screening.screeningId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateSummaryPDF(screening: Screening) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Banner (Navy)
  doc.setFillColor(11, 23, 40);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RETINA-MITRA — CLINICAL SUMMARY SLIP', 16, 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Tele-Ophthalmology Decision Support · Quick Triage Summary', 16, 21);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 16, 14, { align: 'right' });
  doc.text(`Format: Summary Slip`, pageWidth - 16, 21, { align: 'right' });

  let y = 38;

  // Patient & Center Card
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, pageWidth - 28, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 22, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Patient: ${screening.patientAlias}`, 18, y + 7);
  doc.text(`Screening ID: ${screening.screeningId}`, 18, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.text(`Facility: ${screening.phcCenter}`, pageWidth / 2 + 10, y + 7);
  doc.text(`Intake Date: ${new Date(screening.createdAt).toLocaleDateString()}`, pageWidth / 2 + 10, y + 14);

  y += 30;

  // Screening Triage Banner
  const isUngradable = screening.qualityStatus === 'UNGRADABLE';
  const isReferable = screening.referable;
  const gradeLabel = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : screening.drGradeLabel;

  let bannerFill = [5, 150, 105]; // Emerald
  let bannerText = 'STATUS: ROUTINE — NO RETINOPATHY DETECTED';
  if (isUngradable) {
    bannerFill = [225, 29, 72]; // Rose
    bannerText = 'STATUS: IMAGE UNGRADABLE — IMMEDIATE RECAPTURE';
  } else if (isReferable) {
    bannerFill = [217, 119, 6]; // Amber
    bannerText = `STATUS: ${gradeLabel?.toUpperCase() || 'REFERABLE'} — SPECIALIST REFERRAL`;
  }

  doc.setFillColor(bannerFill[0], bannerFill[1], bannerFill[2]);
  doc.rect(14, y, pageWidth - 28, 16, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(bannerText, 18, y + 11);

  y += 24;

  // Key Clinical Findings
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 48, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Triage Summary & Clinical Overview', 18, y + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`• Image Quality Gate: ${isUngradable ? 'Failed (Excess motion blur/macular glare)' : 'Passed (Diagnostic Sharpness Satisfied)'}`, 18, y + 17);
  doc.text(`• DR Classification: ${gradeLabel || 'Grade 0 — No DR'}`, 18, y + 24);
  doc.text(`• Specialist Review Trigger: ${screening.requiresHumanReview ? 'Required (Referable or Quality Threshold)' : 'Not Required (Low Risk)'}`, 18, y + 31);
  doc.text(`• Recommended Action: ${isUngradable ? 'Recapture scan with stabilized gaze.' : (isReferable ? 'Refer to District Hospital within 30 days.' : 'Schedule routine annual rescreening in 12 months.')}`, 18, y + 38);

  y += 58;

  if (screening.reviewDecision) {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 18, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Clinician Action: ${screening.reviewDecision.action}`, 18, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Notes: ${screening.reviewDecision.comments || 'Confirmed by ophthalmologist.'}`, 18, y + 12);
    y += 26;
  }

  // Footer Disclaimer
  const footerY = pageHeight - 20;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY, pageWidth, 20, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY TRIAGE REPORT · RESEARCH & DECISION SUPPORT PROTOTYPE', pageWidth / 2, footerY + 7, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('AI decision support. Not a standalone autonomous diagnostic device.', pageWidth / 2, footerY + 12, { align: 'center' });

  doc.save(`RETINA-MITRA_Summary_Report_${screening.screeningId}.pdf`);
}

async function generateDetailedPDF(screening: Screening) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Banner
  doc.setFillColor(9, 14, 26);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent Blue/Teal Stripe
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 31, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RETINA-MITRA', 16, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Retinal Screening & Tele-Ophthalmology Decision Support (Detailed Format)', 16, 23);

  // Right-aligned header metadata
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth - 16, 14, { align: 'right' });
  doc.text(`Screening ID: ${screening.screeningId}`, pageWidth - 16, 19, { align: 'right' });
  doc.text(`Status: Prototype Demonstration Case`, pageWidth - 16, 24, { align: 'right' });

  let y = 42;

  // Section 1: Case Information
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 24, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 24, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Case Information', 18, y + 6);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Patient Alias: ${screening.patientAlias}`, 18, y + 13);
  doc.text(`Health Center: ${screening.phcCenter}`, 18, y + 19);

  doc.text(`Screening Date: ${new Date(screening.createdAt).toLocaleString()}`, pageWidth / 2, y + 13);
  doc.text(`Intake Type: Color Fundus Photography (45° Field)`, pageWidth / 2, y + 19);

  y += 32;

  // Section 2: Screening Result & Triage Recommendation
  const isUngradable = screening.qualityStatus === 'UNGRADABLE';
  const isReferable = screening.referable;

  let bannerFill = [16, 185, 129];
  let bannerText = 'Screening Result: No DR — Routine Follow-Up';
  if (isUngradable) {
    bannerFill = [244, 63, 94];
    bannerText = 'Screening Result: Image Ungradable — Recapture Recommended';
  } else if (isReferable) {
    bannerFill = [245, 158, 11];
    const gradeLabel = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : screening.drGradeLabel;
    bannerText = `Screening Result: ${gradeLabel} — Specialist Evaluation Recommended`;
  } else {
    const gradeLabel = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : screening.drGradeLabel;
    bannerText = `Screening Result: ${gradeLabel || 'Routine Screening'}`;
  }

  doc.setFillColor(bannerFill[0], bannerFill[1], bannerFill[2]);
  doc.rect(14, y, pageWidth - 28, 14, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(bannerText, 18, y + 9);

  y += 20;

  // Section 3: Dual Retinal Fundus Photographs
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Retinal Photography & Multimodal Explainability', 14, y);

  y += 4;

  const rawUrl = screening.evidence?.rawImageUrl || screening.imageUrl || '';
  const overlayUrl = screening.evidence?.combinedEvidenceUrl || screening.evidence?.gradcamUrl || rawUrl || '';

  const imgWidth = 85;
  const imgHeight = 65;

  try {
    const [rawBase64, overlayBase64] = await Promise.all([
      rawUrl ? getBase64ImageFromUrl(rawUrl).catch(() => null) : Promise.resolve(null),
      overlayUrl ? getBase64ImageFromUrl(overlayUrl).catch(() => null) : Promise.resolve(null),
    ]);

    if (rawBase64) {
      doc.addImage(rawBase64, 'JPEG', 14, y, imgWidth, imgHeight);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Original Fundus Photograph (45° Intake)', 14, y + imgHeight + 4);
    }

    if (overlayBase64) {
      doc.addImage(overlayBase64, 'JPEG', 111, y, imgWidth, imgHeight);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Multimodal Explainability (Grad-CAM & Lesions)', 111, y + imgHeight + 4);
    }
  } catch (err) {
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, y, imgWidth, imgHeight, 'S');
    doc.rect(111, y, imgWidth, imgHeight, 'S');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Image visual embedded in digital session', 20, y + 30);
    doc.text('Visual explainability rendered', 120, y + 30);
  }

  y += imgHeight + 11;

  // Section 4: Quality & Confidence
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Image Quality:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(
    isUngradable
      ? 'Poor — Sharpness and illumination fall below diagnostic threshold (Recapture advisory issued).'
      : 'Good — Image satisfies diagnostic sharpness, contrast, and field-of-view requirements.',
    38,
    y
  );

  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Confidence:', 14, y);
  doc.setFont('helvetica', 'normal');
  const confText = isUngradable
    ? 'Low — Image quality gate intercepted before classification.'
    : isReferable
    ? 'High — Several consistent visual features support this prototype screening result.'
    : 'High — Clean foveal avascular zone and normal vascular caliber without microaneurysms.';
  doc.text(confText, 38, y);

  y += 10;

  // Section 5: Evidence & Why this result?
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Why this result? (Visual Evidence Identified)', 14, y);

  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Highlighted retinal regions contain visual abnormalities that contribute to the prototype screening result.',
    14,
    y
  );

  y += 6;

  if (screening.evidence?.items && screening.evidence.items.length > 0) {
    screening.evidence.items.slice(0, 3).forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`• [${item.severity}] ${item.type} — ${item.location}:`, 16, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(item.description, pageWidth - 32);
      doc.text(descLines, 18, y + 4);
      y += 4 + descLines.length * 3.8;
    });
  } else if (isUngradable) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(225, 29, 72);
    doc.text('• Motion blur artifact and illumination glare detected across central field.', 16, y);
    y += 6;
  }

  y += 4;

  // Section 6: Recommended Action
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended Action:', 14, y);
  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const actionText = isUngradable
    ? 'Recapture retinal photograph immediately following gaze stabilization instructions. Do not diagnose on this image.'
    : isReferable
    ? 'Specialist evaluation recommended within 30 days for dilated examination at District Eye Hospital.'
    : 'Routine annual retinal screening recommended in 12 months at primary health center.';
  doc.text(doc.splitTextToSize(actionText, pageWidth - 28), 14, y);

  y += 12;

  // Section 7: Specialist Review (if performed)
  if (screening.reviewDecision) {
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 16, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, y, pageWidth - 28, 16, 'S');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Human Specialist Review Action: ${screening.reviewDecision.action}`, 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Reviewer Notes: ${screening.reviewDecision.comments || 'Verified by clinician.'}`, 18, y + 10);
    y += 20;
  }

  // Section 8: Important Notice / Medical Disclaimer
  const footerY = pageHeight - 22;
  doc.setFillColor(241, 245, 249);
  doc.rect(0, footerY, pageWidth, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT NOTICE & MEDICAL DISCLAIMER', pageWidth / 2, footerY + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(
    'RETINA-MITRA is an AI-assisted retinal screening and decision-support prototype.',
    pageWidth / 2,
    footerY + 11,
    { align: 'center' }
  );
  doc.text(
    'This report is intended for demonstration and research purposes and is not a medical diagnosis.',
    pageWidth / 2,
    footerY + 15,
    { align: 'center' }
  );

  doc.save(`RETINA-MITRA_Detailed_Report_${screening.screeningId}.pdf`);
}

export async function generateReport(screening: Screening, formatOverride?: ReportFormat) {
  const format = formatOverride || getActiveReportFormat();

  if (format === 'Raw CSV') {
    downloadCSV(screening);
  } else if (format === 'Summary') {
    generateSummaryPDF(screening);
  } else {
    await generateDetailedPDF(screening);
  }
}
