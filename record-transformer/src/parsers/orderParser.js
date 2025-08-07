const fs = require('fs-extra');
const cheerio = require('cheerio');

class OrderParser {
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
            
            const residentOrders = new Map();
            
            // Extract care receivers and their orders (labs, therapies, etc.)
            xmlDoc('CareReceiver').each((index, element) => {
                const careReceiver = xmlDoc(element);
                
                const residentId = careReceiver.attr('InternalID') || 
                                 careReceiver.attr('AdmissionID') || 
                                 careReceiver.attr('EnterpriseID') || 
                                 `unknown_${index}`;
                
                const orders = [];
                
                // Parse medical orders
                careReceiver.find('Order').each((orderIndex, orderElement) => {
                    const order = xmlDoc(orderElement);
                    
                    const medicalOrder = {
                        orderId: order.attr('ResOrderSys') || '',
                        orderNumber: order.attr('resordernum') || '',
                        orderTotal: order.attr('resordertotal') || '',
                        orderType: order.attr('OrderTypeFullDesc') || '',
                        
                        // Order details
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
                        
                        // Lab/Specimen information
                        specimenCollectedBy: order.attr('SpecimenCollctedBy') || '',
                        specimenCollectedByDesc: order.attr('SpecimenCollctedByDesc') || '',
                        specimen: order.attr('Specimen') || '',
                        specimenDesc: order.attr('SpecimenDesc') || '',
                        
                        // Priority and urgency
                        testPriority: order.attr('TestPriority') || '',
                        testPriorityDesc: order.attr('TestPriorityDesc') || '',
                        
                        // Generic substitution (for pharmacy orders)
                        isOriginalDrug: order.attr('isOriginalDrug') === '1',
                        genSubDateActive: order.attr('genSubDateActive') || '',
                        
                        // Administration/Execution schedule
                        hasAdmins: order.attr('hasadmins') === '1',
                        executionSchedule: this.parseExecutionSchedule(order, xmlDoc),
                        
                        // Order category classification
                        category: this.categorizeOrder(order.attr('OrderTypeFullDesc') || '', order.attr('Description') || '')
                    };
                    
                    orders.push(medicalOrder);
                });
                
                if (orders.length > 0) {
                    residentOrders.set(residentId, orders);
                }
            });
            
            console.log(`Parsed orders for ${residentOrders.size} residents from: ${filePath}`);
            return residentOrders;
            
        } catch (error) {
            console.error(`Error parsing order file ${filePath}:`, error);
            return new Map();
        }
    }
    
    static categorizeOrder(orderType, description) {
        const orderTypeLower = orderType.toLowerCase();
        const descriptionLower = description.toLowerCase();
        
        // Categorize based on order type and description
        if (orderTypeLower.includes('lab') || descriptionLower.includes('lab') || 
            descriptionLower.includes('blood') || descriptionLower.includes('urine') ||
            descriptionLower.includes('culture') || descriptionLower.includes('test')) {
            return 'Laboratory';
        }
        
        if (orderTypeLower.includes('therapy') || descriptionLower.includes('therapy') ||
            descriptionLower.includes('physical') || descriptionLower.includes('occupational') ||
            descriptionLower.includes('speech')) {
            return 'Therapy';
        }
        
        if (orderTypeLower.includes('imaging') || descriptionLower.includes('x-ray') ||
            descriptionLower.includes('ct') || descriptionLower.includes('mri') ||
            descriptionLower.includes('ultrasound') || descriptionLower.includes('scan')) {
            return 'Imaging';
        }
        
        if (orderTypeLower.includes('diet') || descriptionLower.includes('diet') ||
            descriptionLower.includes('nutrition') || descriptionLower.includes('food')) {
            return 'Dietary';
        }
        
        if (orderTypeLower.includes('consult') || descriptionLower.includes('consult') ||
            descriptionLower.includes('referral')) {
            return 'Consultation';
        }
        
        // Default category for other orders
        return 'Other';
    }
    
    static parseExecutionSchedule(order, xmlDoc) {
        const schedules = [];
        
        order.find('adminTime').each((index, element) => {
            const adminTime = xmlDoc(element);
            
            const schedule = {
                timeDesc: adminTime.attr('timeDesc') || '',
                isPRN: adminTime.attr('isPRN') === '1',
                
                // Daily execution schedule
                dailySchedule: {},
                
                // Monitoring during execution
                monitoring: this.parseMonitoring(adminTime, xmlDoc),
                
                // Follow-up requirements
                followUps: this.parseFollowUps(adminTime, xmlDoc),
                
                // PRN executions (as needed)
                prnExecutions: this.parsePRNExecutions(adminTime, xmlDoc)
            };
            
            // Parse daily execution schedule (d1, d2, d3, etc.)
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
    
    static parseMonitoring(adminTime, xmlDoc) {
        const monitoring = [];
        
        adminTime.find('pm').each((index, element) => {
            const pm = xmlDoc(element);
            
            const monitoringData = {
                monitoringType: pm.attr('pmType') || '',
                isFollowUpMonitoring: pm.attr('isFupPM') === '1',
                date: pm.attr('date') || '',
                time: pm.attr('time') || '',
                description: pm.attr('desc') || '',
                result: pm.attr('res') || '',
                initials: pm.attr('init') || '',
                
                // Daily monitoring data
                dailyData: {}
            };
            
            // Parse daily monitoring data (d1, d2, d3, etc.)
            for (let day = 1; day <= 31; day++) {
                const dayAttr = `d${day}`;
                const dayValue = pm.attr(dayAttr);
                if (dayValue) {
                    monitoringData.dailyData[dayAttr] = dayValue;
                }
            }
            
            monitoring.push(monitoringData);
        });
        
        return monitoring;
    }
    
    static parseFollowUps(adminTime, xmlDoc) {
        const followUps = [];
        
        adminTime.find('followupTime').each((index, element) => {
            const followUp = xmlDoc(element);
            
            const followUpData = {
                timeDesc: followUp.attr('timeDesc') || '',
                
                // Daily follow-up schedule
                dailySchedule: {},
                
                // Monitoring for follow-ups
                monitoring: this.parseMonitoring(followUp, xmlDoc)
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
    
    static parsePRNExecutions(adminTime, xmlDoc) {
        const prnExecutions = [];
        
        adminTime.find('PRNAdmin').each((index, element) => {
            const prnAdmin = xmlDoc(element);
            
            const prnData = {
                date: prnAdmin.attr('date') || '',
                time: prnAdmin.attr('time') || '',
                status: prnAdmin.attr('status') || '',
                result: prnAdmin.attr('res') || '',
                initials: prnAdmin.attr('init') || '',
                
                // Follow-up data for PRN executions
                showFollowUp: prnAdmin.attr('showfu') === '1',
                followUpDate: prnAdmin.attr('fudate') || '',
                followUpTime: prnAdmin.attr('futime') || '',
                followUpResult: prnAdmin.attr('fures') || '',
                followUpInitials: prnAdmin.attr('fuinit') || '',
                
                // Monitoring for PRN executions
                monitoring: this.parseMonitoring(prnAdmin, xmlDoc)
            };
            
            prnExecutions.push(prnData);
        });
        
        return prnExecutions;
    }
}

module.exports = OrderParser;
