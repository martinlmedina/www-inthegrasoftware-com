/**
 * Google Apps Script — Inthegra Software Contact Form Backend
 *
 * This script receives form submissions from contacto.html,
 * logs them to a Google Sheet, and sends email notifications.
 *
 * SETUP: See docs/SETUP_CONTACTO_BACKEND.md for step-by-step instructions.
 */

/* ── Configuration ── */
var CONFIG_SHEET_NAME = 'Config';   // Sheet tab with email recipients
var DATA_SHEET_NAME   = 'Contactos'; // Sheet tab for form data

/**
 * Handle POST requests from the contact form.
 * Deployed as: Web App → Execute as: Me → Access: Anyone
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Log to Sheet
    logToSheet(ss, data);

    // 2. Send email notifications
    sendNotifications(ss, data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Log form submission as a new row in the Contactos sheet.
 */
function logToSheet(ss, data) {
  var sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(DATA_SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Nombre', 'Empresa', 'Email',
      'Interes', 'Mensaje', 'Origen', 'UTM Source'
    ]);
    // Bold header row
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date(),
    data.name      || '',
    data.company   || '',
    data.email     || '',
    data.interest  || '',
    data.message   || '',
    data.page_origin || '',
    data.utm_source  || ''
  ]);
}

/**
 * Send email notification to all recipients listed in the Config sheet.
 */
function sendNotifications(ss, data) {
  var configSheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!configSheet) return;

  // Read emails from column A (skip header row)
  var lastRow = configSheet.getLastRow();
  if (lastRow < 2) return;

  var emails = configSheet.getRange(2, 1, lastRow - 1, 1).getValues()
    .map(function (row) { return row[0].toString().trim(); })
    .filter(function (email) { return email.length > 0 && email.indexOf('@') > -1; });

  if (emails.length === 0) return;

  var interestLabels = {
    healthcare: 'HealthCare ERP',
    credit: 'Credit & Financial',
    erp: 'Retail & Distribución',
    modernizacion: 'Modernización Oracle Forms',
    oci: 'Oracle Cloud (OCI)',
    desarrollo: 'Desarrollo a Medida',
    analytics: 'Oracle Analytics',
    ai: 'Production AI',
    crm: 'CRM Enterprise',
    chatbot: 'AI Chatbot'
  };

  var interestLabel = interestLabels[data.interest] || data.interest || 'No especificado';

  var subject = 'Nueva consulta web — ' + (data.name || 'Sin nombre') + ' — ' + interestLabel;

  var body = [
    'Nueva consulta desde inthegrasoftware.com',
    '═══════════════════════════════════════',
    '',
    'Nombre:    ' + (data.name || '-'),
    'Empresa:   ' + (data.company || '-'),
    'Email:     ' + (data.email || '-'),
    'Interés:   ' + interestLabel,
    'Mensaje:   ' + (data.message || '-'),
    '',
    '── Tracking ──',
    'Origen:     ' + (data.page_origin || '-'),
    'UTM Source: ' + (data.utm_source || '-'),
    'Timestamp:  ' + (data.timestamp || new Date().toISOString()),
    '',
    '═══════════════════════════════════════',
    'Este email fue generado automáticamente desde el formulario de contacto.'
  ].join('\n');

  var htmlBody = [
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">',
    '  <div style="background:#0F2043;color:white;padding:20px;border-radius:8px 8px 0 0;">',
    '    <h2 style="margin:0;">Nueva consulta web</h2>',
    '    <p style="margin:5px 0 0;opacity:.7;">inthegrasoftware.com</p>',
    '  </div>',
    '  <div style="background:#f8f9fa;padding:20px;border:1px solid #e0e0e0;">',
    '    <table style="width:100%;border-collapse:collapse;">',
    '      <tr><td style="padding:8px 0;color:#666;width:100px;"><strong>Nombre</strong></td><td style="padding:8px 0;">' + escapeHtml(data.name || '-') + '</td></tr>',
    '      <tr><td style="padding:8px 0;color:#666;"><strong>Empresa</strong></td><td style="padding:8px 0;">' + escapeHtml(data.company || '-') + '</td></tr>',
    '      <tr><td style="padding:8px 0;color:#666;"><strong>Email</strong></td><td style="padding:8px 0;"><a href="mailto:' + escapeHtml(data.email || '') + '">' + escapeHtml(data.email || '-') + '</a></td></tr>',
    '      <tr><td style="padding:8px 0;color:#666;"><strong>Interés</strong></td><td style="padding:8px 0;"><span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;">' + escapeHtml(interestLabel) + '</span></td></tr>',
    '    </table>',
    '    <div style="margin-top:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e0e0e0;">',
    '      <strong style="color:#666;">Mensaje:</strong><br>',
    '      <p style="margin:8px 0 0;">' + escapeHtml(data.message || 'Sin mensaje') + '</p>',
    '    </div>',
    '  </div>',
    '  <div style="background:#f0f0f0;padding:12px 20px;border-radius:0 0 8px 8px;font-size:12px;color:#888;border:1px solid #e0e0e0;border-top:0;">',
    '    Origen: ' + escapeHtml(data.page_origin || '-') + ' · UTM: ' + escapeHtml(data.utm_source || '-') + ' · ' + (data.timestamp || new Date().toISOString()),
    '  </div>',
    '</div>'
  ].join('\n');

  MailApp.sendEmail({
    to: emails.join(','),
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    name: 'Inthegra Software Web',
    replyTo: data.email || 'contacto@inthegrasoftware.com'
  });
}

/**
 * Escape HTML special characters for safe email rendering.
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Test function — simulate a form submission locally.
 * Run this from the Apps Script editor to verify everything works.
 */
function testSubmission() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        company: 'Test Company',
        email: 'test@example.com',
        interest: 'oci',
        message: 'This is a test submission',
        page_origin: 'landing_oci',
        utm_source: '',
        timestamp: new Date().toISOString()
      })
    }
  };

  var result = doPost(mockEvent);
  Logger.log(result.getContent());
}
