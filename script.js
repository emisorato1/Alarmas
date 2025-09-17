// Portal de Comunicaciones de Emergencia - JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                // Show target section
                showSection(targetId.substring(1));
                
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Initialize with home section
    showSection('inicio');
});

// Section navigation
function showSection(sectionId) {
    console.log(`Navegando a sección: ${sectionId}`);
    
    // Oculta todas las secciones excepto la de inicio si corresponde
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Oculta la sección de inicio si no estamos en 'inicio'
    const inicioSection = document.getElementById('inicio');
    if (sectionId !== 'inicio' && inicioSection) {
        inicioSection.classList.add('hidden');
    } else if (sectionId === 'inicio' && inicioSection) {
        inicioSection.classList.remove('hidden');
    }

    // Muestra la sección objetivo si no es 'inicio'
    if (sectionId !== 'inicio') {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            console.log(`✅ Sección ${sectionId} mostrada correctamente`);
            // Scroll to top of page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.error(`❌ No se encontró la sección: ${sectionId}`);
        }
    }

    // Actualiza navegación y funcionalidad específica
    updateNavigation(sectionId);
    initializeSection(sectionId);
}

// Update navigation active state
function updateNavigation(activeSectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Initialize section-specific functionality
function initializeSection(sectionId) {
    switch(sectionId) {
        case 'monitoreo':
            initializeMonitoring();
            break;
        case 'mapas':
            initializeMaps();
            break;
        case 'alertas':
            initializeAlerts();
            break;
        case 'comunicaciones':
            initializeCommunications();
            break;
        case 'centro-operaciones':
            initializeOperationsCenter();
            break;
        case 'informacion':
            initializeInformation();
            break;
    }
}

// Map functionality
let emergencyMap;
let mapMode = 'damage';

function initializeMap() {
    // Only initialize if map container exists and map not already initialized
    const mapContainer = document.getElementById('emergency-map');
    if (mapContainer && !emergencyMap) {
        try {
            emergencyMap = L.map('emergency-map').setView([-34.8333, -68.25], 15);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(emergencyMap);
            
            // Add sample markers for different types
            addMapMarkers();
        } catch (error) {
            console.log('Map initialization delayed - Leaflet not loaded yet');
        }
    }
}

function initializeMaps() {
    // Wait for Leaflet to be available
    if (typeof L === 'undefined') {
        setTimeout(initializeMaps, 100);
        return;
    }
    
    if (!emergencyMap) {
        initializeMap();
    }
}

function toggleMapMode(mode) {
    mapMode = mode;
    updateMapMarkers();
    updateMapControls();
}

function updateMapMarkers() {
    // Clear existing markers
    emergencyMap.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            emergencyMap.removeLayer(layer);
        }
    });
    
    // Add markers based on current mode
    addMapMarkers();
}

function addMapMarkers() {
    const markers = {
        damage: [
            {lat: -34.8333, lng: -68.25, type: 'severe', title: 'Daños Severos - Club del Pueblo Las Malvinas'},
            {lat: -34.8350, lng: -68.2480, type: 'moderate', title: 'Daños Moderados - Zona Residencial'},
            {lat: -34.8310, lng: -68.2520, type: 'minor', title: 'Daños Menores - Sector Comercial'}
        ],
        services: [
            {lat: -34.8333, lng: -68.25, type: 'hospital', title: 'Club del Pueblo - Punto de Atención Médica'},
            {lat: -34.8300, lng: -68.2450, type: 'hospital', title: 'Escuela Primaria - Punto de Atención'},
            {lat: -34.8320, lng: -68.2480, type: 'hospital', title: 'Escuela Secundaria - Punto de Atención'},
            {lat: -34.8340, lng: -68.2520, type: 'police', title: 'Club del Pueblo - Puesto de Seguridad'},
            {lat: -34.8310, lng: -68.2460, type: 'fire', title: 'Escuela Primaria - Puesto de Bomberos'}
        ],
        shelters: [
            {lat: -34.8333, lng: -68.25, type: 'shelter', title: 'Club del Pueblo - Albergue Principal (200 personas)'},
            {lat: -34.8300, lng: -68.2450, type: 'shelter', title: 'Escuela Primaria - Albergue (150 personas)'},
            {lat: -34.8320, lng: -68.2480, type: 'shelter', title: 'Escuela Secundaria - Albergue (120 personas)'},
            {lat: -34.8340, lng: -68.2520, type: 'shelter', title: 'Escuela Técnica - Albergue (100 personas)'},
            {lat: -34.8310, lng: -68.2460, type: 'shelter', title: 'Jardín de Infantes - Albergue (80 personas)'}
        ],
        logistics: [
            {lat: -34.8333, lng: -68.25, type: 'warehouse', title: 'Club del Pueblo - Centro de Distribución Principal'},
            {lat: -34.8300, lng: -68.2450, type: 'warehouse', title: 'Escuela Primaria - Centro de Suministros'},
            {lat: -34.8320, lng: -68.2480, type: 'truck', title: 'Escuela Secundaria - Punto de Abastecimiento'},
            {lat: -34.8340, lng: -68.2520, type: 'truck', title: 'Escuela Técnica - Punto de Distribución'},
            {lat: -34.8310, lng: -68.2460, type: 'fuel', title: 'Jardín de Infantes - Punto de Combustible'}
        ]
    };
    
    const currentMarkers = markers[mapMode] || markers.damage;
    
    currentMarkers.forEach(markerData => {
        const icon = getMarkerIcon(markerData.type);
        L.marker([markerData.lat, markerData.lng], {icon: icon})
            .addTo(emergencyMap)
            .bindPopup(markerData.title);
    });
}

function getMarkerIcon(type) {
    const iconColors = {
        severe: '#dc2626',
        moderate: '#f59e0b',
        minor: '#10b981',
        safe: '#3b82f6',
        hospital: '#dc2626',
        police: '#1f2937',
        fire: '#dc2626',
        shelter: '#10b981',
        warehouse: '#6b7280',
        truck: '#f59e0b',
        fuel: '#3b82f6'
    };
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColors[type] || '#6b7280'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

function updateMapControls() {
    // Update button states
    const buttons = document.querySelectorAll('.map-controls .btn');
    buttons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    // Find and highlight active button
    const activeButton = Array.from(buttons).find(btn => 
        btn.onclick.toString().includes(mapMode)
    );
    if (activeButton) {
        activeButton.classList.remove('btn-secondary');
        activeButton.classList.add('btn-primary');
    }
}

// Monitoring functionality
function initializeMonitoring() {
    // Animate antenna status indicators
    const statusIndicators = document.querySelectorAll('.antenna-status-indicator');
    statusIndicators.forEach((indicator, index) => {
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(0.8)';
            setTimeout(() => {
                indicator.style.transition = 'all 0.3s ease';
                indicator.style.opacity = '1';
                indicator.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });
    
    // Simulate real-time updates
    setInterval(updateAntennaStatus, 5000);
}

function updateAntennaStatus() {
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        if (metric.textContent.includes('%')) {
            const currentValue = parseInt(metric.textContent);
            const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const newValue = Math.max(0, Math.min(100, currentValue + variation));
            metric.textContent = newValue + '%';
        }
    });
}

// Alerts functionality
function initializeAlerts() {
    // Add form validation
    const alertForm = document.querySelector('.alert-form');
    if (alertForm) {
        alertForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendAlert();
        });
    }
    
    // Simulate real-time alerts
    setInterval(updateActiveAlerts, 10000);
}

function sendAlert() {
    const alertType = document.getElementById('alert-type').value;
    const alertMessage = document.getElementById('alert-message').value;
    const alertArea = document.getElementById('alert-area').value;
    
    if (!alertMessage.trim()) {
        showNotification('Por favor, ingrese un mensaje de alerta', 'error');
        return;
    }
    
    // Create new alert
    const newAlert = {
        type: alertType,
        message: alertMessage,
        area: alertArea,
        time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
    };
    
    addAlertToList(newAlert);
    
    // Clear form
    document.getElementById('alert-message').value = '';
    
    // Show success notification
    showNotification('Alerta enviada exitosamente', 'success');
    
    // Simulate sending to different channels
    simulateAlertTransmission(newAlert);
}

function addAlertToList(alert) {
    const alertList = document.querySelector('.alert-list');
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${alert.type}`;
    
    const iconClass = {
        emergency: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    }[alert.type];
    
    alertItem.innerHTML = `
        <div class="alert-header">
            <i class="${iconClass}"></i>
            <h4>Alerta ${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</h4>
            <span class="alert-time">Hace 0 min</span>
        </div>
        <p>${alert.message}</p>
        <div class="alert-channels">
            <span class="channel">Radio</span>
            <span class="channel">SMS</span>
        </div>
    `;
    
    alertList.insertBefore(alertItem, alertList.firstChild);
    
    // Remove oldest alert if more than 5
    const alerts = alertList.querySelectorAll('.alert-item');
    if (alerts.length > 5) {
        alertList.removeChild(alerts[alerts.length - 1]);
    }
}

function simulateAlertTransmission(alert) {
    const channels = ['Radio Local', 'SMS Masivo', 'Redes Sociales'];
    
    channels.forEach((channel, index) => {
        setTimeout(() => {
            showNotification(`Transmitiendo por ${channel}...`, 'info');
        }, (index + 1) * 1000);
    });
}

function updateActiveAlerts() {
    const alertTimes = document.querySelectorAll('.alert-time');
    alertTimes.forEach(timeElement => {
        const timeText = timeElement.textContent;
        if (timeText.includes('Hace')) {
            const minutes = parseInt(timeText.match(/\d+/)[0]);
            timeElement.textContent = `Hace ${minutes + 1} min`;
        }
    });
}

// Communications functionality
function initializeCommunications() {
    // Initialize radio controls
    const radioControls = document.querySelectorAll('.broadcast-controls .btn');
    radioControls.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('Iniciar')) {
                startBroadcast();
            } else if (this.textContent.includes('Micrófono')) {
                toggleMicrophone();
            }
        });
    });
}

function startBroadcast() {
    showNotification('Iniciando transmisión de radio...', 'info');
    
    // Simulate broadcast status
    setTimeout(() => {
        showNotification('Transmisión en vivo - Radio Local 88.5 FM', 'success');
    }, 2000);
}

function toggleMicrophone() {
    const micBtn = document.querySelector('.broadcast-controls .btn:last-child');
    const isActive = micBtn.classList.contains('active');
    
    if (isActive) {
        micBtn.classList.remove('active');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i> Micrófono';
        showNotification('Micrófono desactivado', 'info');
    } else {
        micBtn.classList.add('active');
        micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Micrófono';
        showNotification('Micrófono activado', 'success');
    }
}

function useTemplate(button) {
    const templateItem = button.closest('.template-item');
    const message = templateItem.querySelector('p').textContent;
    
    // Fill the alert form with template
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
        alertMessage.value = message;
        showNotification('Plantilla aplicada', 'success');
    }
}

function createBulletin() {
    showNotification('Abriendo editor de boletín...', 'info');
    // In a real application, this would open a modal or new page
}

function scheduleBulletin() {
    showNotification('Abriendo programador de boletines...', 'info');
    // In a real application, this would open a scheduling interface
}

// Operations Center functionality
function initializeOperationsCenter() {
    // Initialize personnel status updates
    setInterval(updatePersonnelStatus, 15000);
    
    // Initialize inventory updates
    setInterval(updateInventory, 30000);
}

function updatePersonnelStatus() {
    const statusElements = document.querySelectorAll('.person .status');
    statusElements.forEach(status => {
        const statuses = ['available', 'busy', 'warning'];
        const currentStatus = status.className.split(' ').find(cls => 
            ['available', 'busy', 'warning'].includes(cls)
        );
        
        // Randomly change status (10% chance)
        if (Math.random() < 0.1) {
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            status.className = `status ${newStatus}`;
            
            const statusTexts = {
                available: 'Disponible',
                busy: 'En Campo',
                warning: 'Mantenimiento'
            };
            
            status.textContent = statusTexts[newStatus];
        }
    });
}

function updateInventory() {
    const quantities = document.querySelectorAll('.quantity');
    quantities.forEach(quantity => {
        const [current, total] = quantity.textContent.split('/').map(Number);
        
        // Simulate small changes in inventory
        if (Math.random() < 0.2) {
            const change = Math.random() < 0.5 ? 1 : -1;
            const newCurrent = Math.max(0, Math.min(total, current + change));
            quantity.textContent = `${newCurrent}/${total}`;
        }
    });
}

// Information functionality
function initializeInformation() {
    // Initialize data source status updates
    setInterval(updateDataSources, 20000);
    
    // Initialize report charts
    animateReportCharts();
}

function updateDataSources() {
    const statusElements = document.querySelectorAll('.data-source .status');
    statusElements.forEach(status => {
        // Randomly update status (5% chance)
        if (Math.random() < 0.05) {
            const statuses = ['operational', 'warning'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            status.className = `status ${newStatus}`;
            status.textContent = newStatus === 'operational' ? 'Activo' : 'Limitado';
        }
    });
}

function animateReportCharts() {
    const chartBars = document.querySelectorAll('.bar-fill');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width || '0%';
        }, index * 200);
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification-success {
                background: #d1fae5;
                color: #065f46;
                border-left: 4px solid #10b981;
            }
            .notification-error {
                background: #fee2e2;
                color: #991b1b;
                border-left: 4px solid #dc2626;
            }
            .notification-warning {
                background: #fef3c7;
                color: #92400e;
                border-left: 4px solid #f59e0b;
            }
            .notification-info {
                background: #eff6ff;
                color: #1e40af;
                border-left: 4px solid #3b82f6;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Emergency mode toggle
function toggleEmergencyMode() {
    document.body.classList.toggle('emergency-mode');
    const isEmergency = document.body.classList.contains('emergency-mode');
    
    showNotification(
        isEmergency ? 'Modo de emergencia activado' : 'Modo normal activado',
        isEmergency ? 'warning' : 'info'
    );
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showSection('inicio');
                break;
            case '2':
                e.preventDefault();
                showSection('monitoreo');
                break;
            case '3':
                e.preventDefault();
                showSection('mapas');
                break;
            case '4':
                e.preventDefault();
                showSection('alertas');
                break;
            case '5':
                e.preventDefault();
                showSection('comunicaciones');
                break;
            case '6':
                e.preventDefault();
                showSection('centro-operaciones');
                break;
            case '7':
                e.preventDefault();
                showSection('informacion');
                break;
        }
    }
    
    // Emergency mode toggle (Ctrl + E)
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        toggleEmergencyMode();
    }
});

// Add emergency mode button to navigation
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('.nav-container');
    const emergencyBtn = document.createElement('button');
    emergencyBtn.className = 'btn btn-emergency';
    emergencyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> EMERGENCIA';
    emergencyBtn.onclick = toggleEmergencyMode;
    emergencyBtn.style.marginLeft = '20px';
    
    navContainer.appendChild(emergencyBtn);
});

// Offline/Online detection
window.addEventListener('online', function() {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
        indicator.innerHTML = '<i class="fas fa-wifi"></i><span>Modo Online</span>';
        indicator.style.background = '#d1fae5';
        indicator.style.color = '#065f46';
    }
    showNotification('Conexión restaurada', 'success');
});

window.addEventListener('offline', function() {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
        indicator.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Modo Offline</span>';
        indicator.style.background = '#fee2e2';
        indicator.style.color = '#991b1b';
    }
    showNotification('Conexión perdida - Modo offline activado', 'warning');
});

// Initialize offline mode if no connection
if (!navigator.onLine) {
    window.dispatchEvent(new Event('offline'));
}

// Test navigation function - for debugging
function testNavigation() {
    const sections = ['inicio', 'monitoreo', 'mapas', 'alertas', 'comunicaciones', 'centro-operaciones', 'informacion'];
    
    console.log('Testing navigation...');
    sections.forEach((sectionId, index) => {
        setTimeout(() => {
            console.log(`Testing section: ${sectionId}`);
            showSection(sectionId);
        }, index * 1000);
    });
}

// Add navigation test button (remove in production)
document.addEventListener('DOMContentLoaded', function() {
    // Add test button for debugging
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Navigation';
    testBtn.style.position = 'fixed';
    testBtn.style.bottom = '20px';
    testBtn.style.right = '20px';
    testBtn.style.zIndex = '9999';
    testBtn.style.padding = '10px';
    testBtn.style.background = '#dc2626';
    testBtn.style.color = 'white';
    testBtn.style.border = 'none';
    testBtn.style.borderRadius = '5px';
    testBtn.style.cursor = 'pointer';
    testBtn.onclick = testNavigation;
    
    // Only add in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.body.appendChild(testBtn);
    }
});