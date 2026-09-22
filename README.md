# MoonaStack — Modern IT Services & Technology Solutions

MoonaStack is a modern, high-performance IT services and software development company website built with clean, semantic HTML5, modern CSS3 (custom variables, flexbox, grid, glassmorphism), and vanilla JavaScript.

It is 100% compliant with **GitHub Pages** hosting and uses a serverless Google Apps Script endpoint to route contact form inquiries directly into a private **Google Sheet** without exposing API keys or secrets.

---

## 📁 Project File Structure

```text
/
├── index.html        # Complete semantic HTML5 structure with SEO metadata
├── css/
│   └── style.css     # Modern design system, typography, responsive layout
├── js/
│   └── script.js     # Interactive canvas, scroll reveal, modals, form dispatch
├── assets/           # Brand icons & imagery
└── README.md         # Deployment & integration manual
```

---

## 🚀 GitHub Pages Deployment Guide

MoonaStack is built as a 100% static, client-side web application. It requires **zero backend servers**, has no runtime secrets, and connects to your Google Drive/Sheets endpoint via client-side requests.

You have **two simple options** to deploy to GitHub Pages:

### Option A: Automated GitHub Actions (Recommended)
This repository includes `.github/workflows/deploy.yml` which automatically builds and deploys on every push:

1. **Create Repository & Push**:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial MoonaStack website"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```
2. **Enable GitHub Pages via Actions**:
   - In your repository, go to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **GitHub Actions**.
   - GitHub will automatically trigger the workflow and publish your site!
3. **Your Live URL**:
   - `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`

---

### Option B: Deploy Pre-built `dist/` or Source Directly
If you prefer not to use GitHub Actions:
1. Run `npm run build` locally to produce the production-ready `dist/` folder.
2. Push or upload the contents of `dist/` to your repository's `main` or `gh-pages` branch.
3. Under **Settings > Pages**, choose **Deploy from a branch**, select branch `main` or `gh-pages` and folder `/ (root)`.
4. Click **Save**.

---

## 📊 Google Drive & Sheets "Site Contact" Lead Dispatch

The contact form is pre-configured to automatically record submissions into a spreadsheet named **Site Contact** in your Google Drive under your account (`codgramming.raheel@gmail.com`).

The script is self-provisioning:
- **Automatic Folder Verification**: It checks if a folder named `MoonaStack Contacts` exists in your Google Drive; if not, it automatically creates it.
- **Automatic Sheet Verification**: It checks if the spreadsheet `Site Contact` exists in that folder; if not, it automatically creates it, sets up the header columns (`Timestamp`, `Name`, `Email`, `Company`, `Phone`, `Service`, `Message`), and styles them.
- **100% GitHub Pages Compatible**: Operates client-side with standard asynchronous HTTP POST requests, requiring zero backend servers.

### Step 1: Open Google Apps Script
1. Go to [Google Apps Script](https://script.google.com) (signed in as `codgramming.raheel@gmail.com`).
2. Click **New project** (top-left button).
3. Name your project: `MoonaStack Lead Dispatcher`.

### Step 2: Paste the Automation Script
Delete any default code in the editor, and paste the code from `/google-apps-script.js`:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
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

    // 1. Check if folder exists in Google Drive; create if missing
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    // 2. Check if 'Site Contact' spreadsheet exists inside folder; create if missing
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
      defaultSheet.getRange("A1:G1").setFontWeight("bold").setBackground("#081229").setFontColor("#00d1ff");
      defaultSheet.setFrozenRows(1);
    }

    // 3. Select the 'Site Contact' sheet
    var sheet = ss.getSheetByName("Site Contact") || ss.getSheets()[0];

    // Ensure header row exists
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
      sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#081229").setFontColor("#00d1ff");
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
```

### Step 3: Deploy as Web App
1. At the top right of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `MoonaStack Site Contact Form Handler`
   - **Execute as**: `Me (codgramming.raheel@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: must be "Anyone" so public submissions from your GitHub Pages website can reach the script)*.
4. Click **Deploy** and authorize the permissions when prompted.
5. Copy the generated **Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`).

### Step 4: Link to Website
1. Open `js/script.js`.
2. Find line 9:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your copied Web App URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Commit and push your changes to GitHub. Any submission on your live GitHub Pages site will now instantly appear as a row in your Google Drive under **MoonaStack Contacts / Site Contact**!

*Note: Before adding your URL, the website gracefully falls back to local lead caching (`localStorage`), ensuring zero errors during offline testing and preview.*

---

## 🎨 Design System & Customization

- **Primary Accent**: Electric Cyan (`#00d1ff`) paired with deep space obsidian (`#030712`).
- **Typography**: Inter for optical body readability and JetBrains Mono for technical snippets.
- **Custom Variables**: Modify brand colors in `css/style.css` under `:root`.
- **Canvas Visual**: The interactive constellation network in the Hero can be adjusted in `initHeroCanvas()` inside `js/script.js`.
