/**
 * CoreServe website enquiry receiver.
 *
 * Setup:
 * 1. Create a Google Sheet and open Extensions > Apps Script.
 * 2. Replace the editor contents with this file and save.
 * 3. Deploy > New deployment > Web app.
 * 4. Execute as: Me. Who has access: Anyone.
 * 5. Copy the /exec URL into NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL in
 *    Cloudflare Pages for Preview and Production, then redeploy.
 */

const SHEET_NAME = "Website Enquiries";
const HEADERS = [
  "Received at",
  "Submitted at",
  "Source",
  "Service page",
  "Cleaning services",
  "Name",
  "Phone",
  "Email",
  "Postcode / location",
  "Property type",
  "Bedrooms",
  "Bathrooms",
  "Occupancy",
  "Required timing",
  "Preferred date",
  "Access / parking",
  "Additional requests",
  "Property condition / notes",
  "Page URL",
];

function doPost(event) {
  const values = event && event.parameter ? event.parameter : {};
  if (values.website) return response({ ok: true });

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setBackground("#062c50")
        .setFontColor("#ffffff")
        .setFontWeight("bold");
    }

    sheet.appendRow([
      new Date(),
      safeCell(values.submittedAt),
      safeCell(values.source),
      safeCell(values.servicePage),
      safeCell(values.cleaningServices),
      safeCell(values.name),
      safeCell(values.phone),
      safeCell(values.email),
      safeCell(values.location),
      safeCell(values.propertyType),
      safeCell(values.bedrooms),
      safeCell(values.bathrooms),
      safeCell(values.occupancy),
      safeCell(values.timing),
      safeCell(values.date),
      safeCell(values.access),
      safeCell(values.extras),
      safeCell(values.message),
      safeCell(values.pageUrl),
    ]);

    return response({ ok: true });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function safeCell(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function response(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
