const fs = require('fs-extra');
const cheerio = require('cheerio');

class MedicationParser {
    static async parse(filePath) {
        try {
            const htmlContent = await fs.readFile(filePath, 'utf8');
            const $ = cheerio.load(htmlContent);
            
            // Extract XML data from the script tag
            const xmlContent = $('#DRXML').text();
            if (!xmlContent) {
                console.warn(`No XML data found in ${filePath}`);
                return new Map();
            }
            
            // Parse XML using cheerio
            const xmlDoc = cheerio.load(xmlContent, { xmlMode: true });
            
            const residentMedications = new Map();
            
            // Extract care receivers and their medication orders
            xmlDoc('CareReceiver').each((index, element) => {
                const careReceiver = xmlDoc(element);
                
                const residentId = careReceiver.attr('InternalID') || 
                                 careReceiver.attr('AdmissionID') || 
                                 careReceiver.attr('EnterpriseID') || 
                                 `unknown_${index}`;
                
                const medications = [];
                
                // Parse medication orders
                careReceiver.find('Order').each((orderIndex, orderElement) => {
                    const order = xmlDoc(orderElement);
                    
                    const medication = {
                        orderId: order.attr('ResOrderSys') || '',
                        orderNumber: order.attr('resordernum') || '',
                        orderTotal: order.attr('resordertotal') || '',
                        orderType: order.attr('OrderTypeFullDesc') || '',
                        
                        // Medication details
                        description: order.attr('Description') || '',
                        quantity: order.attr('Quantity') || '',
                        dosageForm: order.attr('DosageForm') || '',
                        route: order.attr('Route') || '',
                        frequency: order.attr('Frequency') || '',
                        
                        // Dates
                        beginDate: order.attr('BeginDate') || '',
                        endDate: order.attr('EndDate') || '',
                        
                        // Additional information
                        notes: order.attr('Notes') || '',
                        instructions: order.attr('Instructions') || '',
                        treatmentRange: order.attr('TreatmentRange') || '',
                        
                        // Generic substitution info
                        isOriginalDrug: order.attr('isOriginalDrug') === '1',
                        genSubDateActive: order.attr('genSubDateActive') || '',
                        
                        // Specimen information (for lab work)
                        specimenCollectedBy: order.attr('SpecimenCollctedBy') || '',
                        specimenCollectedByDesc: order.attr('SpecimenCollctedByDesc') || '',
                        specimen: order.attr('Specimen') || '',
                        specimenDesc: order.attr('SpecimenDesc') || '',
                        
                        // Priority
                        testPriority: order.attr('TestPriority') || '',
                        testPriorityDesc: order.attr('TestPriorityDesc') || '',
                        
                        // Administration details
                        hasAdmins: order.attr('hasadmins') === '1',
                        administrations: this.parseAdministrations(order, xmlDoc)
                    };
                    
                    medications.push(medication);
                });
                
                if (medications.length > 0) {
                    residentMedications.set(residentId, medications);
                }
            });
            
            console.log(`Parsed medications for ${residentMedications.size} residents from: ${filePath}`);
            return residentMedications;
            
        } catch (error) {
            console.error(`Error parsing medication file ${filePath}:`, error);
            return new Map();
        }
    }
    
    static parseAdministrations(order, xmlDoc) {
        const administrations = [];
        
        order.find('adminTime').each((index, element) => {
            const adminTime = xmlDoc(element);
            
            const administration = {
                timeDesc: adminTime.attr('timeDesc') || '',
                isPRN: adminTime.attr('isPRN') === '1',
                
                // Daily administration data (for scheduled meds)
                dailyAdmins: {},
                
                // Physical monitoring
                physicalMonitoring: this.parsePhysicalMonitoring(adminTime, xmlDoc),
                
                // Follow-up data
                followUps: this.parseFollowUps(adminTime, xmlDoc),
                
                // PRN administrations (if applicable)
                prnAdministrations: this.parsePRNAdministrations(adminTime, xmlDoc)
            };
            
            // Parse daily administration data (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = adminTime.attr(dayAttr);
                if (dayValue) {
                    administration.dailyAdmins[dayAttr] = dayValue;
                }
            }
            
            administrations.push(administration);
        });
        
        return administrations;
    }
    
    static parsePhysicalMonitoring(adminTime, xmlDoc) {
        const physMons = [];
        
        adminTime.find('pm').each((index, element) => {
            const pm = xmlDoc(element);
            
            const physMon = {
                pmType: pm.attr('pmType') || '',
                isFupPM: pm.attr('isFupPM') === '1',
                date: pm.attr('date') || '',
                time: pm.attr('time') || '',
                desc: pm.attr('desc') || '',
                res: pm.attr('res') || '',
                init: pm.attr('init') || '',
                
                // Daily monitoring data
                dailyData: {}
            };
            
            // Parse daily monitoring data (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = pm.attr(dayAttr);
                if (dayValue) {
                    physMon.dailyData[dayAttr] = dayValue;
                }
            }
            
            physMons.push(physMon);
        });
        
        return physMons;
    }
    
    static parseFollowUps(adminTime, xmlDoc) {
        const followUps = [];
        
        adminTime.find('followupTime').each((index, element) => {
            const followUp = xmlDoc(element);
            
            const followUpData = {
                timeDesc: followUp.attr('timeDesc') || '',
                
                // Daily follow-up data
                dailyData: {},
                
                // Physical monitoring for follow-ups
                physicalMonitoring: this.parsePhysicalMonitoring(followUp, xmlDoc)
            };
            
            // Parse daily follow-up data (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = followUp.attr(dayAttr);
                if (dayValue) {
                    followUpData.dailyData[dayAttr] = dayValue;
                }
            }
            
            followUps.push(followUpData);
        });
        
        return followUps;
    }
    
    static parsePRNAdministrations(adminTime, xmlDoc) {
        const prnAdmins = [];
        
        adminTime.find('PRNAdmin').each((index, element) => {
            const prnAdmin = xmlDoc(element);
            
            const prnData = {
                date: prnAdmin.attr('date') || '',
                time: prnAdmin.attr('time') || '',
                status: prnAdmin.attr('status') || '',
                res: prnAdmin.attr('res') || '',
                init: prnAdmin.attr('init') || '',
                
                // Follow-up data for PRN
                showfu: prnAdmin.attr('showfu') === '1',
                fudate: prnAdmin.attr('fudate') || '',
                futime: prnAdmin.attr('futime') || '',
                fures: prnAdmin.attr('fures') || '',
                fuinit: prnAdmin.attr('fuinit') || '',
                
                // Physical monitoring for PRN
                physicalMonitoring: this.parsePhysicalMonitoring(prnAdmin, xmlDoc)
            };
            
            prnAdmins.push(prnData);
        });
        
        return prnAdmins;
    }
}

module.exports = MedicationParser;
