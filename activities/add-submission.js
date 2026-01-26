#!/usr/bin/env node
/**
 * Script to add classroom submission functionality to all worksheets
 *
 * Run with: node add-submission.js
 *
 * This will modify all *-worksheet.html files to include:
 * - Firebase SDK
 * - Firebase config
 * - Classroom submit module
 */

const fs = require('fs');
const path = require('path');

const ACTIVITIES_DIR = __dirname;

// Scripts to inject (before </body>)
const SCRIPTS_TO_INJECT = `
    <!-- Classroom Response System -->
    <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
    <script src="firebase-config.js"></script>
    <script src="classroom-submit.js"></script>
`;

function processWorksheet(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already modified
    if (content.includes('classroom-submit.js')) {
        console.log(`  Skipping (already modified): ${path.basename(filePath)}`);
        return false;
    }

    // Find the closing </body> tag and inject scripts before it
    const bodyCloseIndex = content.lastIndexOf('</body>');
    if (bodyCloseIndex === -1) {
        console.log(`  Error: No </body> tag found in ${path.basename(filePath)}`);
        return false;
    }

    // Inject the scripts
    content = content.slice(0, bodyCloseIndex) + SCRIPTS_TO_INJECT + '\n' + content.slice(bodyCloseIndex);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Modified: ${path.basename(filePath)}`);
    return true;
}

function main() {
    console.log('Adding classroom submission to worksheets...\n');

    // Find all worksheet files
    const files = fs.readdirSync(ACTIVITIES_DIR)
        .filter(f => f.endsWith('-worksheet.html'))
        .map(f => path.join(ACTIVITIES_DIR, f));

    console.log(`Found ${files.length} worksheet files.\n`);

    let modified = 0;
    let skipped = 0;

    files.forEach(file => {
        if (processWorksheet(file)) {
            modified++;
        } else {
            skipped++;
        }
    });

    console.log(`\nDone! Modified: ${modified}, Skipped: ${skipped}`);
    console.log('\nNext steps:');
    console.log('1. Edit firebase-config.js with your Firebase project credentials');
    console.log('2. Open dashboard.html to view class responses');
    console.log('3. Students enter session code in worksheets to submit');
}

main();
