/**
 * Fix the JavaScript syntax error causing loading to fail
 * Removes duplicate closing braces
 */

const fs = require('fs');
const path = require('path');

function fixSyntaxError(filePath) {
    try {
        console.log(`Fixing syntax in ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix the duplicate closing braces issue
        const syntaxErrorPattern = /function SetHeaderLoadingText\(text\) \{[^}]+\}\s*\}\s*function RemoveLoadingText\(\) \{[^}]+\}\s*\}/s;
        const fixedSyntax = `function SetHeaderLoadingText(text) {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.innerText = text;
				loadingElement.style.display = 'block';
			}
		}		
				
		function RemoveLoadingText() {
			var loadingElement = document.getElementById('LoadingTR');
			if (loadingElement) {
				loadingElement.style.display = 'none';
			}
		}`;
        
        if (syntaxErrorPattern.test(content)) {
            content = content.replace(syntaxErrorPattern, fixedSyntax);
            modified = true;
        }
        
        // Alternative pattern to catch the specific syntax error
        const altPattern = /(\}\s*\}\s*function RemoveLoadingText)/g;
        if (altPattern.test(content)) {
            content = content.replace(altPattern, '}		\n				\n		function RemoveLoadingText');
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed syntax error in ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No syntax errors found in ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

function fixAllFiles() {
    const offlineDataDir = 'offline data';
    let fixedCount = 0;
    
    if (!fs.existsSync(offlineDataDir)) {
        console.error('❌ "offline data" directory not found!');
        return;
    }
    
    const facilities = fs.readdirSync(offlineDataDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`Checking facilities: ${facilities.join(', ')}`);
    
    facilities.forEach(facility => {
        const facilityPath = path.join(offlineDataDir, facility);
        const recordFiles = ['TRE_data.html', 'MED_data.html', 'Facesheet_data.html', 'Oth_data.html'];
        
        recordFiles.forEach(file => {
            const filePath = path.join(facilityPath, file);
            if (fs.existsSync(filePath)) {
                if (fixSyntaxError(filePath)) {
                    fixedCount++;
                }
            }
        });
    });
    
    console.log(`\n🎉 Syntax fix complete! Fixed ${fixedCount} files.`);
    console.log('\nPlease refresh your browser to test the loading!');
}

console.log('🔧 Fixing JavaScript syntax errors...\n');
fixAllFiles();