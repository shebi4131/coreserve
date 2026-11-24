/**
 * Email notification for new website quotes — add this to the Apps Script
 * that is attached to your "Clients Quotes" Google Sheet (the one the live
 * website posts to).
 *
 * 1. Open the "Clients Quotes" sheet > Extensions > Apps Script.
 * 2. Paste everything below at the bottom of the existing code and save.
 * 3. In doPost, straight after the line that adds the row to the sheet
 *    (usually sheet.appendRow([...])), add this line:
 *
 *        notifyNewQuote(e.parameter);
 *
 *    (use the same name doPost uses for its argument — e, event, etc.)
 * 4. Select notifyNewQuoteTest in the toolbar and click Run once. Google asks
 *    you to allow sending email; approve it. You should receive a test email.
 * 5. Deploy > Manage deployments > pencil (edit) > Version: New version > Deploy.
 *    Keep the SAME deployment so the /exec URL used by the website stays the same.
 */

const QUOTE_NOTIFY_TO = "coreservegroup@gmail.com,info@coreservegroup.co.uk";

function notifyNewQuote(values) {
  try {
    const v = values || {};
    const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    const dash = (text) => (text && String(text).trim()) || "—";
    const subject = `New website quotation: ${dash(v.name)} — ${dash(v.location)}`;
    const body = [
      "A new quotation has been received.",
      "",
      `Name: ${dash(v.name)}`,
      `Phone: ${dash(v.phone)}`,
      `Email: ${dash(v.email)}`,
      `Location: ${dash(v.location)}`,
      `Services: ${dash(v.cleaningServices)}`,
      `Property type: ${dash(v.propertyType)}`,
      `Bedrooms / bathrooms: ${dash(v.bedrooms)} / ${dash(v.bathrooms)}`,
      `Timing: ${dash(v.timing)}`,
      `Preferred date: ${dash(v.date)}`,
      `Access / parking: ${dash(v.access)}`,
      `Additional requests: ${dash(v.extras)}`,
      `Property details: ${dash(v.message)}`,
      `Source: ${dash(v.source)}`,
      "Page:",
      dash(v.pageUrl),
      "",
      "Open the quotation sheet:",
      sheetUrl,
    ].join("\n");

    const options = { name: "Coreserve Website" };
    if (v.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) options.replyTo = v.email;
    MailApp.sendEmail(QUOTE_NOTIFY_TO, subject, body, options);
  } catch (error) {
    // Never let an email problem stop the quote being saved.
    console.error("Quote email failed", error);
  }
}

/** Run once from the editor to authorise email sending and check delivery. */
function notifyNewQuoteTest() {
  notifyNewQuote({ name: "Test customer", phone: "07000 000000", location: "Test — BB10", cleaningServices: "End-of-Tenancy Cleaning", source: "Apps Script test" });
}
