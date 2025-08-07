/**
 * Add missing toggleWing function to all medical record files
 * This fixes the JavaScript errors caused by wing cards calling undefined functions
 */

const fs = require('fs');
const path = require('path');

const toggleWingFunction = `    <script>
        // Wing toggle functionality for modern interface
        function toggleWing(wingCard) {
            // Toggle active state
            wingCard.classList.toggle('active');
            
            // Toggle the hidden checkbox to maintain compatibility with existing JS
            const checkbox = wingCard.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = wingCard.classList.contains('active');
                // Trigger existing refresh function
                refreshByOrg(checkbox);
            }
        }

        // Enhanced showHideChildOrgs for wing cards (kept for compatibility)
        function showHideChildOrgs(obj) {
            // This function is maintained for compatibility but simplified for wing cards
            const wingCard = obj.closest('.wing-card');
            if (wingCard) {
                toggleWing(wingCard);
            } else {
                // Fallback to original functionality if not a wing card
                var childOrgs = obj.parentElement.querySelectorAll('.divChildOrgs');
                
                if (obj.innerText == "-") {
                    obj.innerText = "+";
                    obj.style.padding = "0 4px 0 4px";
                    childOrgs[0].style.display = "none";
                } else {
                    obj.innerText = "-";
                    obj.style.padding = "0 5px 0 5px";
                    childOrgs[0].style.display = "";
                }
            }
        }
    </script>`;

function addToggleWingFunction(filePath) {
    try {
        console.log(`Adding toggleWing function to ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if toggleWing function already exists
        if (content.includes('function toggleWing')) {
            console.log(`⏭️  toggleWing already exists in ${filePath}`);
            return false;
        }
        
        // Check if wing-card is referenced (meaning this file needs the function)
        if (!content.includes('toggleWing(this)')) {
            console.log(`⏭️  No wing cards found in ${filePath}`);
            return false;
        }
        
        // Add the function before the first <script type="text/javascript"> 
        const insertPattern = /<script type="text\/javascript">/;
        if (insertPattern.test(content)) {
            content = content.replace(insertPattern, toggleWingFunction + '\n    <script type="text/javascript">');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added toggleWing function to ${filePath}`);
            return true;
        } else {
            console.log(`⚠️  Could not find insertion point in ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
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
                if (addToggleWingFunction(filePath)) {
                    fixedCount++;
                }
            }
        });
    });
    
    console.log(`\n🎉 toggleWing fix complete! Fixed ${fixedCount} files.`);
    console.log('\n🔄 Please refresh your browser to test the medical records!');
}

console.log('🔧 Adding missing toggleWing functions...\n');
fixAllFiles();