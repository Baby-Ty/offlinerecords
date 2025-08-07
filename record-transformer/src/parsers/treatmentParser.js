const fs = require('fs-extra');
const cheerio = require('cheerio');

class TreatmentParser {
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
            
            const residentTreatments = new Map();
            
            // Extract care receivers and their treatment orders
            xmlDoc('CareReceiver').each((index, element) => {
                const careReceiver = xmlDoc(element);
                
                const residentId = careReceiver.attr('InternalID') || 
                                 careReceiver.attr('AdmissionID') || 
                                 careReceiver.attr('EnterpriseID') || 
                                 `unknown_${index}`;
                
                const treatments = [];
                
                // Parse treatment orders
                careReceiver.find('Order').each((orderIndex, orderElement) => {
                    const order = xmlDoc(orderElement);
                    
                    const treatment = {
                        orderId: order.attr('ResOrderSys') || '',
                        orderNumber: order.attr('resordernum') || '',
                        orderTotal: order.attr('resordertotal') || '',
                        orderType: order.attr('OrderTypeFullDesc') || '',
                        
                        // Treatment details
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
                        
                        // Specimen/Collection information
                        specimenCollectedBy: order.attr('SpecimenCollctedBy') || '',
                        specimenCollectedByDesc: order.attr('SpecimenCollctedByDesc') || '',
                        specimen: order.attr('Specimen') || '',
                        specimenDesc: order.attr('SpecimenDesc') || '',
                        
                        // Priority
                        testPriority: order.attr('TestPriority') || '',
                        testPriorityDesc: order.attr('TestPriorityDesc') || '',
                        
                        // Administration/Treatment schedule
                        hasAdmins: order.attr('hasadmins') === '1',
                        treatmentSchedule: this.parseTreatmentSchedule(order, xmlDoc)
                    };
                    
                    treatments.push(treatment);
                });
                
                if (treatments.length > 0) {
                    residentTreatments.set(residentId, treatments);
                }
            });
            
            console.log(`Parsed treatments for ${residentTreatments.size} residents from: ${filePath}`);
            return residentTreatments;
            
        } catch (error) {
            console.error(`Error parsing treatment file ${filePath}:`, error);
            return new Map();
        }
    }
    
    static parseTreatmentSchedule(order, xmlDoc) {
        const schedules = [];
        
        order.find('adminTime').each((index, element) => {
            const adminTime = xmlDoc(element);
            
            const schedule = {
                timeDesc: adminTime.attr('timeDesc') || '',
                isPRN: adminTime.attr('isPRN') === '1',
                
                // Daily treatment schedule (for routine treatments)
                dailySchedule: {},
                
                // Physical monitoring during treatments
                physicalMonitoring: this.parsePhysicalMonitoring(adminTime, xmlDoc),
                
                // Follow-up treatments
                followUps: this.parseFollowUps(adminTime, xmlDoc),
                
                // PRN treatments (as needed)
                prnTreatments: this.parsePRNTreatments(adminTime, xmlDoc)
            };
            
            // Parse daily treatment schedule (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = adminTime.attr(dayAttr);
                if (dayValue) {
                    schedule.dailySchedule[dayAttr] = dayValue;
                }
            }
            
            schedules.push(schedule);
        });
        
        return schedules;
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
                result: pm.attr('res') || '',
                initials: pm.attr('init') || '',
                
                // Daily monitoring results
                dailyResults: {}
            };
            
            // Parse daily monitoring results (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = pm.attr(dayAttr);
                if (dayValue) {
                    physMon.dailyResults[dayAttr] = dayValue;
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
                
                // Daily follow-up schedule
                dailySchedule: {},
                
                // Physical monitoring for follow-ups
                physicalMonitoring: this.parsePhysicalMonitoring(followUp, xmlDoc)
            };
            
            // Parse daily follow-up schedule (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = followUp.attr(dayAttr);
                if (dayValue) {
                    followUpData.dailySchedule[dayAttr] = dayValue;
                }
            }
            
            followUps.push(followUpData);
        });
        
        return followUps;
    }
    
    static parsePRNTreatments(adminTime, xmlDoc) {
        const prnTreatments = [];
        
        adminTime.find('PRNAdmin').each((index, element) => {
            const prnAdmin = xmlDoc(element);
            
            const prnData = {
                date: prnAdmin.attr('date') || '',
                time: prnAdmin.attr('time') || '',
                status: prnAdmin.attr('status') || '',
                result: prnAdmin.attr('res') || '',
                initials: prnAdmin.attr('init') || '',
                
                // Follow-up data for PRN treatments
                showFollowUp: prnAdmin.attr('showfu') === '1',
                followUpDate: prnAdmin.attr('fudate') || '',
                followUpTime: prnAdmin.attr('futime') || '',
                followUpResult: prnAdmin.attr('fures') || '',
                followUpInitials: prnAdmin.attr('fuinit') || '',
                
                // Physical monitoring for PRN treatments
                physicalMonitoring: this.parsePhysicalMonitoring(prnAdmin, xmlDoc)
            };
            
            prnTreatments.push(prnData);
        });
        
        return prnTreatments;
    }
}

module.exports = TreatmentParser;
