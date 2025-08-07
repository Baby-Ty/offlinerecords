const fs = require('fs-extra');
const path = require('path');

const FacesheetParser = require('../parsers/facesheetParser');
const MedicationParser = require('../parsers/medicationParser');
const TreatmentParser = require('../parsers/treatmentParser');
const OrderParser = require('../parsers/orderParser');

const DATA_DIR = path.join(__dirname, '../../data');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const PARSED_DIR = path.join(DATA_DIR, 'parsed');

const processFiles = async () => {
    try {
        console.log('Starting file processing...');
        
        // Find all facility directories
        const allItems = await fs.readdir(RAW_DIR);
        const facilityDirs = [];
        
        for (const item of allItems) {
            const itemPath = path.join(RAW_DIR, item);
            const stat = await fs.stat(itemPath);
            if (stat.isDirectory()) {
                facilityDirs.push(itemPath);
            }
        }
        
        console.log(`Found ${facilityDirs.length} facility directories`);
        
        const allResidents = new Map();
        let processedCount = 0;
        
        for (const facilityDir of facilityDirs) {
            const facilityName = path.basename(facilityDir);
            console.log(`Processing facility: ${facilityName}`);
            
            try {
                // Process each type of file
                const facesheetFile = path.join(facilityDir, 'Facesheet_data.html');
                const medicationFile = path.join(facilityDir, 'MED_data.html');
                const treatmentFile = path.join(facilityDir, 'TRE_data.html');
                const orderFile = path.join(facilityDir, 'Oth_data.html');
                
                // Parse facesheet data first (contains resident demographics)
                if (await fs.pathExists(facesheetFile)) {
                    const facesheetResidents = await FacesheetParser.parse(facesheetFile);
                    for (const resident of facesheetResidents) {
                        const residentId = resident.ResidentID;
                        if (!allResidents.has(residentId)) {
                            allResidents.set(residentId, {
                                ResidentID: residentId,
                                Name: resident.Name,
                                facility: facilityName,
                                facesheet: resident.facesheet || {},
                                medications: [],
                                treatments: [],
                                orders: []
                            });
                        }
                        // Update facesheet data
                        allResidents.get(residentId).facesheet = resident.facesheet || {};
                        allResidents.get(residentId).Name = resident.Name;
                    }
                }
                
                // Parse medication data
                if (await fs.pathExists(medicationFile)) {
                    const medicationData = await MedicationParser.parse(medicationFile);
                    for (const [residentId, medications] of medicationData) {
                        if (allResidents.has(residentId)) {
                            allResidents.get(residentId).medications = medications;
                        }
                    }
                }
                
                // Parse treatment data
                if (await fs.pathExists(treatmentFile)) {
                    const treatmentData = await TreatmentParser.parse(treatmentFile);
                    for (const [residentId, treatments] of treatmentData) {
                        if (allResidents.has(residentId)) {
                            allResidents.get(residentId).treatments = treatments;
                        }
                    }
                }
                
                // Parse order data
                if (await fs.pathExists(orderFile)) {
                    const orderData = await OrderParser.parse(orderFile);
                    for (const [residentId, orders] of orderData) {
                        if (allResidents.has(residentId)) {
                            allResidents.get(residentId).orders = orders;
                        }
                    }
                }
                
                processedCount++;
                
            } catch (facilityError) {
                console.error(`Error processing facility ${facilityName}:`, facilityError);
            }
        }
        
        // Save individual resident files
        await fs.ensureDir(PARSED_DIR);
        
        for (const [residentId, residentData] of allResidents) {
            const filePath = path.join(PARSED_DIR, `${residentId}.json`);
            await fs.writeJson(filePath, residentData, { spaces: 2 });
        }
        
        // Create index file with all residents list
        const residentsList = Array.from(allResidents.values()).map(resident => ({
            ResidentID: resident.ResidentID,
            Name: resident.Name,
            facility: resident.facility,
            hasData: {
                facesheet: Object.keys(resident.facesheet || {}).length > 0,
                medications: resident.medications.length > 0,
                treatments: resident.treatments.length > 0,
                orders: resident.orders.length > 0
            }
        }));
        
        await fs.writeJson(path.join(PARSED_DIR, 'index.json'), {
            lastUpdated: new Date().toISOString(),
            totalResidents: residentsList.length,
            facilitiesProcessed: processedCount,
            residents: residentsList
        }, { spaces: 2 });
        
        console.log(`Processing complete. ${residentsList.length} residents processed from ${processedCount} facilities.`);
        
        return {
            success: true,
            residentsProcessed: residentsList.length,
            facilitiesProcessed: processedCount,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error processing files:', error);
        throw error;
    }
};

module.exports = {
    processFiles
};
