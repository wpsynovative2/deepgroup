// Deep Group lead webhook. Deploy as a Web app (Execute as: Me, Access: Anyone).
// Script properties: SHARED_SECRET (required), NOTIFY_EMAIL, CP_NOTIFY_EMAIL, RESUME_FOLDER_ID (optional).
// After every change: Manage deployments → Edit → New version.

const HEADERS = {
  Leads: ["timestamp","fullName","mobile","email","project","unit","intent","message","source",
          "utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid",
          "landingPage","referrer","recaptchaScore","quality","duplicate"],
  Redevelopment: ["timestamp","fullName","mobile","email","societyName","location","members",
          "plotArea","buildingAge","designation","message","source","utm_source","utm_medium",
          "utm_campaign","gclid","fbclid","recaptchaScore","quality","duplicate"],
  Careers: ["timestamp","fullName","mobile","email","position","experience","currentLocation",
          "resumeUrl","message","source","recaptchaScore","quality","duplicate"],
  ChannelPartners: ["timestamp","fullName","mobile","email","firmName","reraAgentNo","operatingAreas",
          "experienceYears","teamSize","message","source","utm_source","utm_medium","utm_campaign",
          "recaptchaScore","quality","duplicate","status"],
};
// Keep "mobile" as the 3rd column in every tab; isDuplicate() relies on it.
// "status" is left blank for the CP desk to fill (Pending / Verified / Empanelled / Rejected).

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    if (body.secret !== props.getProperty("SHARED_SECRET")) return json({ ok: false, error: "unauthorized" });

    const sheetName = HEADERS[body.sheet] ? body.sheet : "Leads";
    const sheet = getSheet(sheetName);
    const data = body.data || {};

    if (sheetName === "Careers" && data.resumeBase64) {
      data.resumeUrl = saveResume(data, props.getProperty("RESUME_FOLDER_ID"));
    }
    data.duplicate = isDuplicate(sheet, data.mobile) ? "yes" : "";

    // Store mobile as text so leading digits/format are preserved
    const row = HEADERS[sheetName].map((h) => (h === "mobile" ? "'" + (data[h] || "") : data[h] ?? ""));
    sheet.appendRow(row);

    const notify = (sheetName === "ChannelPartners" && props.getProperty("CP_NOTIFY_EMAIL"))
      || props.getProperty("NOTIFY_EMAIL");
    if (notify) {
      MailApp.sendEmail(notify, `New ${sheetName} enquiry: ${data.fullName}`,
        `${data.fullName}\n${data.mobile}\n${data.project || data.societyName || data.position || data.firmName || ""}\n${data.source}`);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS[name]);
  return sheet;
}

function isDuplicate(sheet, mobile) {
  const last = sheet.getLastRow();
  if (last < 2 || !mobile) return false;
  const start = Math.max(2, last - 200);
  const rows = sheet.getRange(start, 1, last - start + 1, 3).getValues(); // timestamp, name, mobile
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return rows.some((r) => String(r[2]).replace("'", "") === mobile && new Date(r[0]).getTime() > dayAgo);
}

function saveResume(data, folderId) {
  const blob = Utilities.newBlob(Utilities.base64Decode(data.resumeBase64), data.resumeMime, data.resumeName);
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  delete data.resumeBase64;
  return file.getUrl();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
