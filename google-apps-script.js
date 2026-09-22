/**
 * MoonaStack - Google Drive & Sheets "Site Contact" Lead Dispatcher
 * Target Google Account: codgramming.raheel@gmail.com
 * 
 * Instructions:
 * 1. Open https://script.google.com and click "New project".
 * 2. Delete any boilerplate code and paste this entire file.
 * 3. Click "Deploy" > "New deployment".
 * 4. Select type: "Web app".
 * 5. Configuration:
 *    - Description: "MoonaStack Site Contact Form Handler"
 *    - Execute as: "Me (codgramming.raheel@gmail.com)"
 *    - Who has access: "Anyone" (Required so your static GitHub Pages site can post data)
 * 6. Click "Deploy" and authorize access when prompted.
 * 7. Copy the generated Web App URL and paste it into js/script.js:
 *    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
 * 8. Commit and push to GitHub Pages!
 *
 * Self-Healing Capabilities:
 * - Checks if the Google Drive folder "MoonaStack Contacts" exists; creates it if missing.
 * - Checks if the "Site Contact" spreadsheet exists inside the folder; creates it if missing.
 * - Formats headers automatically ("Timestamp", "Name", "Email", "Company", "Phone", "Service", "Message").
 * - Appends every inquiry reliably.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent submissions to prevent race conditions
  lock.tryLock(10000);
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var folderName = "MoonaStack Contacts";
    var spreadsheetName = "Site Contact";

    // 1. Check if the folder exists in Google Drive; create if not
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    // 2. Check if the "Site Contact" spreadsheet exists inside the folder; create if not
    var files = folder.getFilesByName(spreadsheetName);
    var ss;
    if (files.hasNext()) {
      var file = files.next();
      ss = SpreadsheetApp.open(file);
    } else {
      ss = SpreadsheetApp.create(spreadsheetName);
      var newFile = DriveApp.getFileById(ss.getId());
      folder.addFile(newFile);
      DriveApp.getRootFolder().removeFile(newFile);

      // Initialize the default sheet as "Site Contact" with stylized headers
      var defaultSheet = ss.getSheets()[0];
      defaultSheet.setName("Site Contact");
      defaultSheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Company",
        "Phone",
        "Service",
        "Message"
      ]);
      defaultSheet.getRange("A1:G1")
        .setFontWeight("bold")
        .setBackground("#081229")
        .setFontColor("#00d1ff");
      defaultSheet.setFrozenRows(1);
    }

    // 3. Retrieve the "Site Contact" sheet
    var sheet = ss.getSheetByName("Site Contact") || ss.getSheets()[0];

    // Ensure header row exists if sheet was manually emptied
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Company",
        "Phone",
        "Service",
        "Message"
      ]);
      sheet.getRange("A1:G1")
        .setFontWeight("bold")
        .setBackground("#081229")
        .setFontColor("#00d1ff");
      sheet.setFrozenRows(1);
    }

    // 4. Append lead entry
    sheet.appendRow([
      data.formattedDate || new Date().toLocaleString(),
      data.name || "",
      data.email || "",
      data.company || "",
      data.phone || "",
      data.service || "",
      data.message || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead recorded in Site Contact sheet under " + folderName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Optional GET test to verify deployment status from a browser
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "MoonaStack Site Contact Google Apps Script is active and listening."
  })).setMimeType(ContentService.MimeType.JSON);
}
