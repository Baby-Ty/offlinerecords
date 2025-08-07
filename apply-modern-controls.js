/**
 * Script to apply modern display controls to all medical record files
 * Run this to update all TRE, MED, and Facesheet files with the new interface
 */

const fs = require('fs');
const path = require('path');

// Define the old clunky interface pattern to replace
const oldInterfacePattern = /(<div id="allcontrols" class="controlsDiv">.*?<\/div>)/s;

// Define the new modern interface
const modernInterface = `    <!-- Modern Display Controls - Much cleaner and space-efficient -->
    <div id="allcontrols" class="modern-controls">
        <!-- Loading indicator -->
        <div id="LoadingTR" class="loading-text" style="display: none;">
            Loading Data...
        </div>
        
        <!-- Header with title and print button -->
        <div class="controls-header">
            <h3 class="controls-title">Display Options</h3>
            <button class="print-btn" onclick="window.print();" id="printSpan">
                🖨️ Print
            </button>
        </div>
        
        <!-- Controls grid layout -->
        <div class="controls-grid">
            
            <!-- Organization Controls -->
            <div class="control-group">
                <h5>Wings</h5>
                <div class="org-controls" id="tblOrgList">
                    <!-- Wings will be populated here by existing JavaScript -->
                    <div class="facility-title">Russell LTC</div>
                    <div class="wing-cards">
                        <!-- Wing cards will be populated dynamically -->
                    </div>
                </div>
            </div>
            
            <!-- Display Settings -->
            <div class="control-group">
                <h5>Display Settings</h5>
                
                <div class="form-row">
                    <label for="selFontSize">Font Size:</label>
                    <select id="selFontSize" onchange="changeFontSize(this)">
                        <option value="11">Normal</option>
                        <option value="10">Small</option>
                        <option value="9">Smaller</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <label for="selTotalSigLines">Signature Lines:</label>
                    <select id="selTotalSigLines" onchange="showSigLines()">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3" selected="selected">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <label for="selShowResDetails">Patient Details:</label>
                    <select id="selShowResDetails" onchange="showHideResDetail()">
                        <option value="Both">Above & Below</option>
                        <option value="Top">Above Only</option>
                        <option value="Bottom">Below Only</option>
                        <option value="Neither">Hidden</option>
                    </select>
                </div>
            </div>
            
            <!-- Page Settings -->
            <div class="control-group">
                <h5>Page Settings</h5>
                
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="chkShadeDays" onclick="shadeDays()" checked />
                        <label for="chkShadeDays">Shade Mon/Fri</label>
                    </div>
                    
                    <div class="checkbox-item">
                        <input type="checkbox" id="chkResBreaks" onclick="showHideResPageBreaks()" checked />
                        <label for="chkResBreaks">Page break per patient</label>
                    </div>
                    
                    <div class="checkbox-item">
                        <input type="checkbox" id="chkOrderBreaks" onclick="showHideResOrderBreaks()" checked />
                        <label for="chkOrderBreaks">Page break every</label>
                        <select id="selOrderBreakNum" onchange="showHideResOrderBreaks()">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5" selected="selected">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <span style="font-size: 13px; color: #475569;">orders</span>
                    </div>
                </div>
            </div>
            
        </div>
    </div>`;

// Function to update a single file
function updateFile(filePath) {
    try {
        console.log(`Updating ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add modern CSS if not already present
        if (!content.includes('modern-record-controls.css')) {
            content = content.replace(
                '<link rel="stylesheet" href="../../Data/medical-records.css">',
                '<link rel="stylesheet" href="../../Data/medical-records.css">\n    <link rel="stylesheet" href="../../styles/modern-record-controls.css">'
            );
        }
        
        // Replace the old interface with modern one
        if (oldInterfacePattern.test(content)) {
            content = content.replace(oldInterfacePattern, modernInterface);
            
            // Update organization templates
            content = content.replace(
                /<script id="orgTable" type="text\/template">.*?<\/script>/s,
                `<script id="orgTable" type="text/template">
        <div class="facility-title">{{fullname}}</div>
        <div class="wing-cards">
            {{org2}}
        </div>
    </script>`
            );
            
            content = content.replace(
                /<script id="org2" type="text\/template">.*?<\/script>/s,
                `<script id="org2" type="text/template">
        <div class="wing-card active" onclick="toggleWing(this);" data-wing="{{name}}">
            <input type="checkbox" name="chkOrgName2" class="chkOrgName2" onclick="refreshByOrg(this)" checked />
            <div name="divOES2" class="divOES2" style="display:none">{{oes}}</div>
            {{name}}
            <div name="divChildOrgs" class="divChildOrgs" style="display:none;">
                {{org3}}
            </div>
        </div>
    </script>`
            );
            
            content = content.replace(
                /<script id="org3" type="text\/template">.*?<\/script>/s,
                `<script id="org3" type="text/template">
        <!-- Child organizations handled within parent wing card -->
        <input type="checkbox" name="chkOrgName3" class="chkOrgName3" onclick="refreshByOrg(this)" checked style="display: none;" />
        <div name="divOES3" class="divOES3" style="display:none">{{oes}}</div>
    </script>`
            );
            
            // Fix loading text functions for new interface
            content = content.replace(
                /function SetHeaderLoadingText\(text\) \{[^}]+\}/s,
                `function SetHeaderLoadingText(text) {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.innerText = text;
				loadingElement.style.display = 'block';
			}
		}`
            );
            
            content = content.replace(
                /function RemoveLoadingText\(\) \{[^}]+\}/s,
                `function RemoveLoadingText() {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.style.display = 'none';
			}
		}`
            );
            
            // Fix parseOrgXML to properly remove loading text and use global regex
            content = content.replace(
                /(orgContainer\.innerHTML = templateString;)(\s*})/,
                `$1
			
			// Hide loading text after org data is loaded
			RemoveLoadingText();$2`
            );
            
            // Fix template replacement to use global regex
            content = content.replace(
                /templateString\.replace\('{{([^}]+)}}'/g,
                "templateString.replace(/{{$1}}/g"
            );
            
            content = content.replace(
                /midHTML\.replace\('{{([^}]+)}}'/g,
                "currentMidHTML.replace(/{{$1}}/g"
            );
            
            content = content.replace(
                /childHTML\.replace\('{{([^}]+)}}'/g,
                "currentChildHTML.replace(/{{$1}}/g"
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Successfully updated ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  Skipped ${filePath} - no old interface found`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Function to find and update all medical record files
function updateAllFiles() {
    const offlineDataDir = 'offline data';
    let updatedCount = 0;
    
    if (!fs.existsSync(offlineDataDir)) {
        console.error('❌ "offline data" directory not found!');
        return;
    }
    
    // Get all facility directories
    const facilities = fs.readdirSync(offlineDataDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`Found facilities: ${facilities.join(', ')}`);
    
    // Update each facility's record files
    facilities.forEach(facility => {
        const facilityPath = path.join(offlineDataDir, facility);
        const recordFiles = ['TRE_data.html', 'MED_data.html', 'Facesheet_data.html', 'Oth_data.html'];
        
        recordFiles.forEach(file => {
            const filePath = path.join(facilityPath, file);
            if (fs.existsSync(filePath)) {
                if (updateFile(filePath)) {
                    updatedCount++;
                }
            }
        });
    });
    
    console.log(`\n🎉 Update complete! Modified ${updatedCount} files.`);
    console.log('\nThe display controls are now modern, clean, and space-efficient!');
}

// Run the update
console.log('🚀 Starting modern control interface update...\n');
updateAllFiles();