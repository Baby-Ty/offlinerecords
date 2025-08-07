/**
 * Fix the loading text issue in all medical record files
 * This addresses the "Loading data..." getting stuck problem
 */

const fs = require('fs');
const path = require('path');

// Function to fix loading functions in a file
function fixLoadingIssue(filePath) {
    try {
        console.log(`Fixing loading issue in ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix SetHeaderLoadingText function
        const oldSetHeaderText = /function SetHeaderLoadingText\(text\) \{[^}]+\}/s;
        const newSetHeaderText = `function SetHeaderLoadingText(text) {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.innerText = text;
				loadingElement.style.display = 'block';
			}
		}`;
        
        if (oldSetHeaderText.test(content)) {
            content = content.replace(oldSetHeaderText, newSetHeaderText);
            modified = true;
        }
        
        // Fix RemoveLoadingText function
        const oldRemoveText = /function RemoveLoadingText\(\) \{[^}]+\}/s;
        const newRemoveText = `function RemoveLoadingText() {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.style.display = 'none';
			}
		}`;
        
        if (oldRemoveText.test(content)) {
            content = content.replace(oldRemoveText, newRemoveText);
            modified = true;
        }
        
        // Add RemoveLoadingText call to parseOrgXML if not present
        const parseOrgPattern = /(orgContainer\.innerHTML = templateString;)(\s*})(\s*function|\s*$)/;
        if (parseOrgPattern.test(content) && !content.includes('RemoveLoadingText();')) {
            content = content.replace(parseOrgPattern, `$1
			
			// Hide loading text after org data is loaded
			RemoveLoadingText();$2$3`);
            modified = true;
        }
        
        // Fix template replacement to use global regex for proper parsing
        const templateReplacements = [
            { old: /templateString\.replace\('{{([^}]+)}}'/g, new: "templateString.replace(/{{$1}}/g" },
            { old: /midHTML\.replace\('{{([^}]+)}}'/g, new: "currentMidHTML.replace(/{{$1}}/g" },
            { old: /childHTML\.replace\('{{([^}]+)}}'/g, new: "currentChildHTML.replace(/{{$1}}/g" }
        ];
        
        templateReplacements.forEach(replacement => {
            if (replacement.old.test(content)) {
                content = content.replace(replacement.old, replacement.new);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed loading issue in ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed in ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

// Function to fix all medical record files
function fixAllFiles() {
    const offlineDataDir = 'offline data';
    let fixedCount = 0;
    
    if (!fs.existsSync(offlineDataDir)) {
        console.error('❌ "offline data" directory not found!');
        return;
    }
    
    // Get all facility directories
    const facilities = fs.readdirSync(offlineDataDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`Found facilities: ${facilities.join(', ')}`);
    
    // Fix each facility's record files
    facilities.forEach(facility => {
        const facilityPath = path.join(offlineDataDir, facility);
        const recordFiles = ['TRE_data.html', 'MED_data.html', 'Facesheet_data.html', 'Oth_data.html'];
        
        recordFiles.forEach(file => {
            const filePath = path.join(facilityPath, file);
            if (fs.existsSync(filePath)) {
                if (fixLoadingIssue(filePath)) {
                    fixedCount++;
                }
            }
        });
    });
    
    console.log(`\n🎉 Loading fix complete! Fixed ${fixedCount} files.`);
    console.log('\nThe wing cards should now load properly without getting stuck!');
}

// Run the fix
console.log('🔧 Starting loading issue fix...\n');
fixAllFiles();