/**
 * Reusable UI Components for Medical Records Interface
 */

class ResidentProfileCard {
    static create(resident) {
        const template = document.getElementById('residentCardTemplate');
        if (!template) return null;

        let html = template.innerHTML;
        
        // Replace template variables
        html = html.replace(/{residentId}/g, resident.ResidentID);
        html = html.replace(/{name}/g, resident.Name || 'Unknown Name');
        html = html.replace(/{facility}/g, resident.facility || 'Unknown Facility');
        
        // Set badge classes based on data availability
        html = html.replace(/{facesheetClass}/g, 
            resident.hasData?.facesheet ? 'has-data' : 'no-data');
        html = html.replace(/{medicationsClass}/g, 
            resident.hasData?.medications ? 'has-data' : 'no-data');
        html = html.replace(/{treatmentsClass}/g, 
            resident.hasData?.treatments ? 'has-data' : 'no-data');
        html = html.replace(/{ordersClass}/g, 
            resident.hasData?.orders ? 'has-data' : 'no-data');

        const cardElement = document.createElement('div');
        cardElement.innerHTML = html;
        return cardElement.firstElementChild;
    }
}

class ResidentTable {
    static create(residents) {
        const container = document.createElement('div');
        container.className = 'resident-table-container';

        const table = document.createElement('table');
        table.className = 'resident-table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        [
            'Name',
            'ID',
            'Facility',
            'FACE',
            'MEDS',
            'TREAT',
            'ORDERS'
        ].forEach(label => {
            const th = document.createElement('th');
            th.textContent = label;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Body
        const tbody = document.createElement('tbody');
        residents.forEach(resident => {
            const tr = document.createElement('tr');

            // Name
            const nameTd = document.createElement('td');
            nameTd.setAttribute('data-label', 'Name');
            const nameLink = document.createElement('a');
            nameLink.href = '#';
            nameLink.className = 'resident-name-link';
            nameLink.textContent = resident.Name || 'Unknown Name';
            nameLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.showResidentDetail) {
                    window.showResidentDetail(resident.ResidentID);
                }
            });
            nameTd.appendChild(nameLink);
            tr.appendChild(nameTd);

            // ID
            const idTd = document.createElement('td');
            idTd.setAttribute('data-label', 'ID');
            idTd.textContent = resident.ResidentID ?? '';
            tr.appendChild(idTd);

            // Facility
            const facTd = document.createElement('td');
            facTd.setAttribute('data-label', 'Facility');
            facTd.textContent = resident.facility || 'Unknown';
            tr.appendChild(facTd);

            // Helper to create pill
            const createPill = (active) => {
                const span = document.createElement('span');
                span.className = `pill ${active ? 'pill-active' : 'pill-inactive'}`;
                span.textContent = active ? 'Yes' : 'No';
                return span;
            };

            // FACE
            const faceTd = document.createElement('td');
            faceTd.setAttribute('data-label', 'FACE');
            faceTd.appendChild(createPill(Boolean(resident.hasData?.facesheet)));
            tr.appendChild(faceTd);

            // MEDS
            const medsTd = document.createElement('td');
            medsTd.setAttribute('data-label', 'MEDS');
            medsTd.appendChild(createPill(Boolean(resident.hasData?.medications)));
            tr.appendChild(medsTd);

            // TREAT
            const treatTd = document.createElement('td');
            treatTd.setAttribute('data-label', 'TREAT');
            treatTd.appendChild(createPill(Boolean(resident.hasData?.treatments)));
            tr.appendChild(treatTd);

            // ORDERS
            const ordersTd = document.createElement('td');
            ordersTd.setAttribute('data-label', 'ORDERS');
            ordersTd.appendChild(createPill(Boolean(resident.hasData?.orders)));
            tr.appendChild(ordersTd);

            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
        return container;
    }
}

class MedicationTable {
    static create(medications) {
        if (!medications || medications.length === 0) {
            return this.createEmptyState('No medications found');
        }

        const table = document.createElement('table');
        table.className = 'medication-table';
        table.style.cssText = `
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0;
        `;

        // Header
        const header = document.createElement('thead');
        header.innerHTML = `
            <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Medication</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Dosage</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Route</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Frequency</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Start Date</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Status</th>
            </tr>
        `;
        table.appendChild(header);

        // Body
        const tbody = document.createElement('tbody');
        medications.forEach((med, index) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            
            row.innerHTML = `
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    <strong>${med.description || 'Unknown'}</strong>
                    ${med.notes ? `<br><small style="color: #6c757d;">${med.notes}</small>` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    ${med.quantity || ''} ${med.dosageForm || ''}
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    ${med.route || ''}
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    ${med.frequency || ''}
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    ${this.formatDate(med.beginDate)}
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">
                    <span class="status-badge ${this.getStatusClass(med)}">
                        ${this.getStatusText(med)}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        return table;
    }

    static getStatusClass(med) {
        if (med.endDate && new Date(med.endDate) < new Date()) {
            return 'status-ended';
        }
        if (med.hasAdmins) {
            return 'status-active';
        }
        return 'status-scheduled';
    }

    static getStatusText(med) {
        if (med.endDate && new Date(med.endDate) < new Date()) {
            return 'Ended';
        }
        if (med.hasAdmins) {
            return 'Active';
        }
        return 'Scheduled';
    }

    static formatDate(dateString) {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    }

    static createEmptyState(message) {
        const div = document.createElement('div');
        div.className = 'empty-state';
        div.style.cssText = `
            text-align: center; 
            padding: 40px; 
            color: #6c757d; 
            background: #f8f9fa; 
            border-radius: 6px;
        `;
        div.innerHTML = `<p>${message}</p>`;
        return div;
    }
}

class TreatmentTimeline {
    static create(treatments) {
        if (!treatments || treatments.length === 0) {
            return MedicationTable.createEmptyState('No treatments found');
        }

        const container = document.createElement('div');
        container.className = 'treatment-timeline';

        treatments.forEach(treatment => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.style.cssText = `
                border-left: 3px solid #007bff;
                padding-left: 15px;
                margin-bottom: 20px;
                position: relative;
            `;

            item.innerHTML = `
                <div class="timeline-marker" style="
                    position: absolute;
                    left: -7px;
                    top: 5px;
                    width: 10px;
                    height: 10px;
                    background: #007bff;
                    border-radius: 50%;
                "></div>
                <div class="treatment-header" style="margin-bottom: 8px;">
                    <strong>${treatment.description || 'Unknown Treatment'}</strong>
                    <span style="float: right; color: #6c757d; font-size: 0.9em;">
                        ${treatment.orderType || ''}
                    </span>
                </div>
                <div class="treatment-details" style="color: #495057;">
                    ${treatment.frequency ? `<div><strong>Frequency:</strong> ${treatment.frequency}</div>` : ''}
                    ${treatment.beginDate ? `<div><strong>Start:</strong> ${MedicationTable.formatDate(treatment.beginDate)}</div>` : ''}
                    ${treatment.endDate ? `<div><strong>End:</strong> ${MedicationTable.formatDate(treatment.endDate)}</div>` : ''}
                    ${treatment.instructions ? `<div><strong>Instructions:</strong> ${treatment.instructions}</div>` : ''}
                    ${treatment.notes ? `<div><strong>Notes:</strong> ${treatment.notes}</div>` : ''}
                </div>
            `;

            container.appendChild(item);
        });

        return container;
    }
}

class OrderList {
    static create(orders) {
        if (!orders || orders.length === 0) {
            return MedicationTable.createEmptyState('No orders found');
        }

        // Group orders by category
        const grouped = this.groupOrdersByCategory(orders);
        
        const container = document.createElement('div');
        container.className = 'order-list';

        Object.entries(grouped).forEach(([category, categoryOrders]) => {
            const section = document.createElement('div');
            section.className = 'order-category';
            section.style.cssText = `
                margin-bottom: 25px;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                overflow: hidden;
            `;

            const header = document.createElement('div');
            header.className = 'category-header';
            header.style.cssText = `
                background: #e9ecef;
                padding: 12px 15px;
                font-weight: bold;
                color: #495057;
                border-bottom: 1px solid #dee2e6;
            `;
            header.innerHTML = `${category} Orders (${categoryOrders.length})`;

            const content = document.createElement('div');
            content.className = 'category-content';
            content.style.padding = '15px';

            categoryOrders.forEach(order => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.style.cssText = `
                    padding: 12px;
                    margin-bottom: 10px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border-left: 4px solid ${this.getCategoryColor(category)};
                `;

                orderItem.innerHTML = `
                    <div class="order-header" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>${order.description || 'Unknown Order'}</strong>
                        <span class="priority-badge ${this.getPriorityClass(order.testPriority)}" style="
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 0.8em;
                            font-weight: bold;
                        ">
                            ${order.testPriority || 'Normal'}
                        </span>
                    </div>
                    <div class="order-details" style="font-size: 0.9em; color: #6c757d;">
                        ${order.beginDate ? `<div><strong>Ordered:</strong> ${MedicationTable.formatDate(order.beginDate)}</div>` : ''}
                        ${order.specimen ? `<div><strong>Specimen:</strong> ${order.specimen}</div>` : ''}
                        ${order.instructions ? `<div><strong>Instructions:</strong> ${order.instructions}</div>` : ''}
                        ${order.notes ? `<div><strong>Notes:</strong> ${order.notes}</div>` : ''}
                    </div>
                `;

                content.appendChild(orderItem);
            });

            section.appendChild(header);
            section.appendChild(content);
            container.appendChild(section);
        });

        return container;
    }

    static groupOrdersByCategory(orders) {
        const grouped = {};
        orders.forEach(order => {
            const category = order.category || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(order);
        });
        return grouped;
    }

    static getCategoryColor(category) {
        const colors = {
            'Laboratory': '#dc3545',
            'Imaging': '#fd7e14',
            'Therapy': '#198754',
            'Dietary': '#6f42c1',
            'Consultation': '#0dcaf0',
            'Other': '#6c757d'
        };
        return colors[category] || colors['Other'];
    }

    static getPriorityClass(priority) {
        const priorityLower = (priority || '').toLowerCase();
        if (priorityLower.includes('stat') || priorityLower.includes('urgent')) {
            return 'priority-urgent';
        }
        if (priorityLower.includes('asap')) {
            return 'priority-asap';
        }
        return 'priority-normal';
    }
}

// Add CSS for status badges and priority classes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .status-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: bold;
    }
    
    .status-active {
        background: #d4edda;
        color: #155724;
    }
    
    .status-scheduled {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-ended {
        background: #f8d7da;
        color: #721c24;
    }
    
    .priority-urgent {
        background: #dc3545;
        color: white;
    }
    
    .priority-asap {
        background: #fd7e14;
        color: white;
    }
    
    .priority-normal {
        background: #28a745;
        color: white;
    }
    
    .medication-table th {
        background: #f8f9fa !important;
    }
    
    .medication-table tr:hover {
        background: #e3f2fd !important;
    }
    
    .timeline-item:hover {
        background: rgba(0, 123, 255, 0.05);
        border-radius: 4px;
        margin-left: -10px;
        padding-left: 25px;
        transition: all 0.3s ease;
    }
    
    .order-item:hover {
        background: #e3f2fd !important;
        transform: translateX(5px);
        transition: all 0.3s ease;
    }
`;

if (!document.head.querySelector('style[data-components="true"]')) {
    styleSheet.setAttribute('data-components', 'true');
    document.head.appendChild(styleSheet);
}
