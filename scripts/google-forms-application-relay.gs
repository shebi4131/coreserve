/**
 * CoreServe cleaner-application relay.
 *
 * Browsers cannot read a Google Forms response (no CORS), so the website cannot tell whether
 * an application was accepted. This relay forwards the application to the same Google Form
 * from Google's servers, checks the result, and replies with JSON the website can read.
 * Applications still land in the Google Form and its linked sheet exactly as before.
 *
 * Setup:
 * 1. Go to script.google.com > New project. Paste this file and save.
 *    (Use a NEW project, not the enquiry webhook project.)
 * 2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * 3. Copy the /exec URL into NEXT_PUBLIC_APPLICATION_RELAY_URL in Cloudflare Pages
 *    (Preview and Production) and in .env.local, then rebuild/redeploy.
 *
 * Until NEXT_PUBLIC_APPLICATION_RELAY_URL is set, the website keeps posting straight to the
 * Google Form as it did before.
 */

const FORM_RESPONSE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeUxVfeizHz3ewmjv1nGgtbhwFD8LrmQk_cLD8oIsDtIc_iCQ/formResponse";

const ALLOWED_KEYS = /^(entry\.\d+(\.other_option_response)?|fvv|pageHistory)$/;

function doPost(event) {
  const params = (event && event.parameters) || {};
  if (params.website && String(params.website[0] || "")) return response({ ok: true });

  const parts = [];
  Object.keys(params).forEach(function (key) {
    if (!ALLOWED_KEYS.test(key)) return;
    params[key].forEach(function (value) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(value)));
    });
  });

  if (!parts.length) return response({ ok: false, error: "Empty application" });

  try {
    const result = UrlFetchApp.fetch(FORM_RESPONSE_URL, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      payload: parts.join("&"),
      followRedirects: false, // closed or restricted forms redirect instead of returning 200
      muteHttpExceptions: true,
    });
    const code = result.getResponseCode();
    return response(code === 200 ? { ok: true } : { ok: false, error: "Google Form returned HTTP " + code });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  }
}

function response(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
