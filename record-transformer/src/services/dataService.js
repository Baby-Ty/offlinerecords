const fs = require('fs-extra');
const path = require('path');

const PARSED_DIR = path.join(__dirname, '../../data/parsed');

// Anonymized data template for demo mode
const generateAnonymizedResident = (residentId) => {
    const baseData = {
        "10001": {
            ResidentID: "10001",
            Name: "Anderson, Emily R",
            facility: "DEMO_DAY",
            facesheet: {
                ResidentName: "Anderson, Emily R",
                Age: "72",
                BirthDate: "1952-06-18",
                Gender: "Female",
                MaritalStatusDesc: "Widowed",
                Allergies: "Shellfish (anaphylaxis), Latex (mild reaction)",
                AdmittingDiagICD1: "Chronic Heart Failure (I50.9)",
                AdvancedDirectives: "DNR on file, Healthcare proxy designated",
                LevelOfCare: "Skilled Nursing",
                EmergencyContact: "Thompson, Jennifer (Daughter) - (555) 123-4567",
                PrimaryPhysician: "Dr. Martinez, Carlos MD - Cardiology Associates",
                InsuranceInfo: "Medicare Primary, Medicaid Secondary"
            },
            medications: [
                {
                    description: "Lisinopril 10mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily at 08:00",
                    beginDate: "2024-01-15",
                    hasAdmins: true,
                    notes: "Monitor blood pressure, target <140/90"
                },
                {
                    description: "Furosemide 40mg Tablet", 
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily in morning",
                    beginDate: "2024-01-15", 
                    hasAdmins: true,
                    notes: "Diuretic for fluid management, monitor I&O"
                }
            ],
            treatments: [
                {
                    description: "Physical Therapy - Gait Training",
                    orderType: "Therapy",
                    frequency: "3x weekly",
                    beginDate: "2024-01-20",
                    instructions: "Focus on balance and mobility improvement",
                    notes: "Patient reports improved confidence with walking"
                }
            ],
            orders: [
                {
                    description: "Basic Metabolic Panel",
                    category: "Laboratory",
                    testPriority: "Routine",
                    beginDate: "2024-02-15",
                    specimen: "Blood",
                    instructions: "Morning draw, fasting not required",
                    notes: "Monitor kidney function and electrolytes"
                }
            ]
        },
        "10002": {
            ResidentID: "10002",
            Name: "Williams, Robert J", 
            facility: "DEMO_LTC",
            facesheet: {
                ResidentName: "Williams, Robert J",
                Age: "84",
                BirthDate: "1940-11-03",
                Gender: "Male", 
                MaritalStatusDesc: "Married",
                Allergies: "Penicillin (rash), Sulfa drugs (GI upset)",
                AdmittingDiagICD1: "Alzheimer's Disease (F03.90)",
                AdvancedDirectives: "DNR, Comfort Care Measures",
                LevelOfCare: "Long-term Care",
                EmergencyContact: "Williams, Dorothy (Spouse) - (555) 234-5678",
                PrimaryPhysician: "Dr. Chen, Lisa MD - Geriatric Medicine",
                InsuranceInfo: "Medicare Part A & B, Long-term Care Insurance"
            },
            medications: [
                {
                    description: "Donepezil 10mg Tablet",
                    quantity: "1",
                    dosageForm: "tablet",
                    route: "Oral",
                    frequency: "Daily at bedtime", 
                    beginDate: "2024-01-10",
                    hasAdmins: true,
                    notes: "Alzheimer's treatment, monitor for GI side effects"
                }
            ],
            treatments: [
                {
                    description: "Memory Care Activities",
                    orderType: "Activity Therapy",
                    frequency: "Daily",
                    beginDate: "2024-01-10",
                    instructions: "Structured activities for cognitive stimulation",
                    notes: "Responds well to music therapy"
                }
            ],
            orders: [
                {
                    description: "Comprehensive Metabolic Panel", 
                    category: "Laboratory",
                    testPriority: "Routine",
                    beginDate: "2024-02-25",
                    specimen: "Blood",
                    instructions: "Morning draw, baseline labs",
                    notes: "Monitor for medication side effects"
                }
            ]
        }
    };

    // If we have specific data for this resident, return it
    if (baseData[residentId]) {
        return baseData[residentId];
    }

    // Generate data for Protea Valley residents based on ID ranges
    let facility = "PROTEA_LTC";
    let facilityName = "Long Term Care";
    
    if (residentId.startsWith("20")) {
        facility = "PROTEA_LTC";
        facilityName = "Long Term Care";
    } else if (residentId.startsWith("30")) {
        facility = "PROTEA_RC";
        facilityName = "Residential Care";
    } else if (residentId.startsWith("40")) {
        facility = "PROTEA_OP";
        facilityName = "Outpatient Services";
    } else if (residentId.startsWith("50")) {
        facility = "PROTEA_DAY";
        facilityName = "Day Services";
    }

    // Generate demographic variety
    const ages = ["68", "72", "75", "78", "81", "84", "87", "90"];
    const genders = ["Male", "Female"];
    const maritalStatuses = ["Married", "Widowed", "Single", "Divorced"];
    
    const ageIndex = parseInt(residentId.slice(-2)) % ages.length;
    const genderIndex = parseInt(residentId.slice(-1)) % genders.length;
    const maritalIndex = parseInt(residentId.slice(-2)) % maritalStatuses.length;

    return {
        ResidentID: residentId,
        Name: `Protea Resident ${residentId}`,
        facility: facility,
        facesheet: {
            ResidentName: `Protea Resident ${residentId}`,
            Age: ages[ageIndex],
            BirthDate: `19${56 - parseInt(ages[ageIndex]) + 68}-0${(parseInt(residentId.slice(-1)) % 9) + 1}-${10 + (parseInt(residentId.slice(-2)) % 18)}`,
            Gender: genders[genderIndex],
            MaritalStatusDesc: maritalStatuses[maritalIndex],
            Allergies: "NKDA (No Known Drug Allergies)",
            AdmittingDiagICD1: "General Medical Care",
            AdvancedDirectives: "On file",
            LevelOfCare: "Standard Care",
            EmergencyContact: "Family Contact - (555) 123-4567",
            PrimaryPhysician: "Dr. Smith, John MD - Protea Valley Medical",
            InsuranceInfo: "Medicare Primary"
        },
        medications: [
            {
                description: "Multivitamin 1 Tablet",
                quantity: "1",
                dosageForm: "tablet",
                route: "Oral",
                frequency: "Daily",
                beginDate: "2024-01-01",
                hasAdmins: true,
                notes: "General health maintenance"
            }
        ],
        treatments: [
            {
                description: "General Care Activities",
                orderType: "Nursing",
                frequency: "Daily",
                beginDate: "2024-01-01",
                instructions: "Standard care protocols",
                notes: "Routine care and monitoring"
            }
        ],
        orders: [
            {
                description: "Annual Physical Assessment",
                category: "Assessment",
                testPriority: "Routine",
                beginDate: "2024-02-01",
                instructions: "Complete annual assessment",
                notes: "Standard annual review"
            }
        ]
    };
};

const getResidents = async () => {
    try {
        // Prioritize anonymized data for demo mode
        const anonymizedIndexPath = path.join(PARSED_DIR, 'anonymized-index.json');
        
        if (await fs.pathExists(anonymizedIndexPath)) {
            console.log('Using anonymized data from anonymized-index.json');
            const anonymizedData = await fs.readJson(anonymizedIndexPath);
            return anonymizedData;
        }
        
        // Fall back to regular index if anonymized data not available
        const indexPath = path.join(PARSED_DIR, 'index.json');
        
        if (!(await fs.pathExists(indexPath))) {
            return {
                lastUpdated: null,
                totalResidents: 0,
                facilitiesProcessed: 0,
                residents: []
            };
        }
        
        console.log('Using regular data from index.json');
        const indexData = await fs.readJson(indexPath);
        return indexData;
        
    } catch (error) {
        console.error('Error getting residents list:', error);
        throw error;
    }
};

const getResident = async (residentId) => {
    try {
        // For anonymized demo residents (IDs 20001-50021), generate data from template
        if (residentId.match(/^[2-5]00(0[1-9]|1[0-9]|2[0-1])$/)) {
            console.log(`Generating anonymized data for resident ${residentId}`);
            return generateAnonymizedResident(residentId);
        }
        
        // For regular residents, use the parsed files
        const residentPath = path.join(PARSED_DIR, `${residentId}.json`);
        
        if (!(await fs.pathExists(residentPath))) {
            return null;
        }
        
        console.log(`Using regular data for resident ${residentId}`);
        const residentData = await fs.readJson(residentPath);
        return residentData;
        
    } catch (error) {
        console.error(`Error getting resident ${residentId}:`, error);
        throw error;
    }
};

const getStatus = async () => {
    try {
        const anonymizedIndexPath = path.join(PARSED_DIR, 'anonymized-index.json');
        const indexPath = path.join(PARSED_DIR, 'index.json');
        const rawDir = path.join(__dirname, '../../data/raw');
        
        let lastProcessed = null;
        let totalResidents = 0;
        let facilitiesProcessed = 0;
        let dataType = 'REGULAR';
        
        // Check if using anonymized data
        if (await fs.pathExists(anonymizedIndexPath)) {
            const anonymizedData = await fs.readJson(anonymizedIndexPath);
            lastProcessed = anonymizedData.lastUpdated;
            totalResidents = anonymizedData.totalResidents;
            facilitiesProcessed = anonymizedData.facilitiesProcessed;
            dataType = 'DEMO_ANONYMIZED';
            console.log('Status reporting anonymized data usage');
        } else if (await fs.pathExists(indexPath)) {
            const indexData = await fs.readJson(indexPath);
            lastProcessed = indexData.lastUpdated;
            totalResidents = indexData.totalResidents;
            facilitiesProcessed = indexData.facilitiesProcessed;
            dataType = 'REGULAR';
            console.log('Status reporting regular data usage');
        }
        
        // Get information about raw files
        const rawFilesInfo = {};
        
        try {
            const facilityDirs = await fs.readdir(rawDir);
            
            for (const facilityDir of facilityDirs) {
                const facilityPath = path.join(rawDir, facilityDir);
                const stat = await fs.stat(facilityPath);
                
                if (stat.isDirectory()) {
                    const files = {};
                    const fileTypes = ['Facesheet_data.html', 'MED_data.html', 'TRE_data.html', 'Oth_data.html'];
                    
                    for (const fileType of fileTypes) {
                        const filePath = path.join(facilityPath, fileType);
                        if (await fs.pathExists(filePath)) {
                            const fileStat = await fs.stat(filePath);
                            files[fileType] = {
                                exists: true,
                                lastModified: fileStat.mtime.toISOString(),
                                size: fileStat.size
                            };
                        } else {
                            files[fileType] = {
                                exists: false
                            };
                        }
                    }
                    
                    rawFilesInfo[facilityDir] = files;
                }
            }
        } catch (rawDirError) {
            console.warn('Could not read raw directory:', rawDirError.message);
        }
        
        return {
            status: 'running',
            lastProcessed,
            totalResidents,
            facilitiesProcessed,
            dataType,
            rawFiles: rawFilesInfo,
            parsedDataLocation: PARSED_DIR,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error getting status:', error);
        throw error;
    }
};

module.exports = {
    getResidents,
    getResident,
    getStatus
};
