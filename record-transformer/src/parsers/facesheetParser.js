const fs = require('fs-extra');
const cheerio = require('cheerio');

class FacesheetParser {
    static async parse(filePath) {
        try {
            const htmlContent = await fs.readFile(filePath, 'utf8');
            const $ = cheerio.load(htmlContent);
            
            // Extract XML data from the script tag
            const xmlContent = $('#FSXML').text();
            if (!xmlContent) {
                console.warn(`No XML data found in ${filePath}`);
                return [];
            }
            
            // Parse XML using cheerio
            const xmlDoc = cheerio.load(xmlContent, { xmlMode: true });
            
            const residents = [];
            
            // Extract care receivers (residents)
            xmlDoc('CareReceiver').each((index, element) => {
                const careReceiver = xmlDoc(element);
                
                const residentId = careReceiver.attr('InternalID') || 
                                 careReceiver.attr('AdmissionID') || 
                                 careReceiver.attr('EnterpriseID') || 
                                 `unknown_${index}`;
                
                const resident = {
                    ResidentID: residentId,
                    Name: careReceiver.attr('ResidentName') || '',
                    facesheet: {
                        // Basic Demographics
                        InternalID: careReceiver.attr('InternalID') || '',
                        AdmissionID: careReceiver.attr('AdmissionID') || '',
                        EnterpriseID: careReceiver.attr('EnterpriseID') || '',
                        ResidentName: careReceiver.attr('ResidentName') || '',
                        PreferredName: careReceiver.attr('PreferredName') || '',
                        Age: careReceiver.attr('Age') || '',
                        BirthDate: careReceiver.attr('BirthDate') || '',
                        Gender: careReceiver.attr('Gender') || '',
                        
                        // Contact Information
                        Phone: careReceiver.attr('Phone') || '',
                        EmailAddress: careReceiver.attr('EmailAddress') || '',
                        PrimaryResidence: careReceiver.attr('PrimaryResidence') || '',
                        County: careReceiver.attr('County') || '',
                        
                        // Administrative Information
                        OrgLocation: careReceiver.attr('OrgLocation') || '',
                        FacilityName: careReceiver.attr('FacilityName') || '',
                        AdmitDate: careReceiver.attr('AdmitDate') || '',
                        AdmitTime: careReceiver.attr('AdmitTime') || '',
                        DischargeDate: careReceiver.attr('DischargeDate') || '',
                        LevelOfCare: careReceiver.attr('LevelOfCare') || '',
                        
                        // Medical Information
                        SocSecNum: careReceiver.attr('SocSecNum') || '',
                        MedicaidNum: careReceiver.attr('MedicaidNum') || '',
                        MedicareANum: careReceiver.attr('MedicareANum') || '',
                        MedicareBNum: careReceiver.attr('MedicareBNum') || '',
                        OtherInsNum: careReceiver.attr('OtherInsNum') || '',
                        
                        // Diagnoses
                        AdmittingDiagICD1Hdr: careReceiver.attr('AdmittingDiagICD1Hdr') || '',
                        AdmittingDiagICD1: careReceiver.attr('AdmittingDiagICD1') || '',
                        AdmittingDiagICD2Hdr: careReceiver.attr('AdmittingDiagICD2Hdr') || '',
                        AdmittingDiagICD2: careReceiver.attr('AdmittingDiagICD2') || '',
                        OtherDiagICD1Hdr: careReceiver.attr('OtherDiagICD1Hdr') || '',
                        OtherDiagICD1: careReceiver.attr('OtherDiagICD1') || '',
                        OtherDiagICD2Hdr: careReceiver.attr('OtherDiagICD2Hdr') || '',
                        OtherDiagICD2: careReceiver.attr('OtherDiagICD2') || '',
                        
                        // Medical Alerts & Information
                        Allergies: careReceiver.attr('Allergies') || '',
                        Medications: careReceiver.attr('Medications') || '',
                        AdvancedDirectives: careReceiver.attr('AdvancedDirectives') || '',
                        ClinicalAlerts: careReceiver.attr('ClinicalAlerts') || '',
                        PsychotherapyAlerts: careReceiver.attr('PsychotherapyAlerts') || '',
                        
                        // Cultural & Personal Information
                        Religion: careReceiver.attr('Religion') || '',
                        PrimaryLanguage: careReceiver.attr('PrimaryLanguage') || '',
                        Nationality: careReceiver.attr('Nationality') || '',
                        Ethnicity: careReceiver.attr('Ethnicity') || '',
                        MaritalStatusDesc: careReceiver.attr('MaritalStatusDesc') || '',
                        
                        // Related Parties
                        physicians: this.parsePhysicians(careReceiver),
                        relatedParties: this.parseRelatedParties(careReceiver),
                        otherParties: this.parseOtherParties(careReceiver),
                        
                        // Additional Information
                        stays: this.parseStays(careReceiver),
                        surgicalProcedures: this.parseSurgicalProcedures(careReceiver),
                        referralAgencies: this.parseReferralAgencies(careReceiver),
                        notes: this.parseNotes(careReceiver)
                    }
                };
                
                residents.push(resident);
            });
            
            console.log(`Parsed ${residents.length} residents from facesheet: ${filePath}`);
            return residents;
            
        } catch (error) {
            console.error(`Error parsing facesheet file ${filePath}:`, error);
            return [];
        }
    }
    
    static parsePhysicians(careReceiver) {
        const physicians = [];
        // For now, return empty array to avoid cheerio constructor issues
        // This can be enhanced later when we debug the exact XML structure
        return physicians;
    }
    
    static parseRelatedParties(careReceiver) {
        const relatedParties = [];
        // For now, return empty array to avoid cheerio constructor issues
        // This can be enhanced later when we debug the exact XML structure
        return relatedParties;
    }
    
    static parseOtherParties(careReceiver) {
        const otherParties = [];
        // For now, return empty array to avoid cheerio constructor issues
        // This can be enhanced later when we debug the exact XML structure
        return otherParties;
    }
    
    static parseStays(careReceiver) {
        const stays = [];
        // For now, return empty array to avoid cheerio constructor issues
        // This can be enhanced later when we debug the exact XML structure
        return stays;
    }
    
    static parseSurgicalProcedures(careReceiver) {
        const procedures = [];
        // For now, return empty array to avoid cheerio constructor issues
        // This can be enhanced later when we debug the exact XML structure
        return procedures;
    }
    
    static parseReferralAgencies(careReceiver) {
        const agencies = [];
        // For now, return empty array to avoid cheerio constructor issues
        return agencies;
    }
    
    static parseNotes(careReceiver) {
        const notes = [];
        // For now, return empty array to avoid cheerio constructor issues
        return notes;
    }
}

module.exports = FacesheetParser;
