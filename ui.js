/**
 * UI Management for Multigrafo Bus Routes
 * Handles UI interactions, DOM manipulations, and event listeners
 */

import Multigrafo from './graph.js';

// Create instance of Multigrafo
const multigrafo = new Multigrafo();

// Initialize with example data
multigrafo.inicializarExemplo();

// DOM Elements
const citiesContainer = document.getElementById('cities-container');
const routesContainer = document.getElementById('routes-container');
const addCityBtn = document.getElementById('add-city-btn');
const addRouteBtn = document.getElementById('add-route-btn');
const addCityModal = document.getElementById('add-city-modal');
const addRouteModal = document.getElementById('add-route-modal');
const addCityForm = document.getElementById('add-city-form');
const addRouteForm = document.getElementById('add-route-form');
const closeBtns = document.querySelectorAll('.close-btn');
const themeButton = document.getElementById('theme-button');

// Filter elements
const filterOrigin = document.getElementById('filter-origin');
const filterDestination = document.getElementById('filter-destination');
const filterCompany = document.getElementById('filter-company');

// Route form elements
const routeOrigin = document.getElementById('route-origin');
const routeDestination = document.getElementById('route-destination');

/**
 * Initialize the UI
 */
function initUI() {
  // Render initial data
  renderCities();
  renderRoutes();
  updateFilters();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check if dark mode is preferred
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleTheme();
  }
  
  // Apply initial animations
  applyAnimations();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Modal open buttons
  addCityBtn.addEventListener('click', () => showModal(addCityModal));
  addRouteBtn.addEventListener('click', () => showModal(addRouteModal));
  
  // Modal close buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      hideModal(modal);
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      hideModal(e.target);
    }
  });
  
  // Form submissions
  addCityForm.addEventListener('submit', handleAddCity);
  addRouteForm.addEventListener('submit', handleAddRoute);
  
  // Filter changes
  filterOrigin.addEventListener('change', updateRoutesDisplay);
  filterDestination.addEventListener('change', updateRoutesDisplay);
  filterCompany.addEventListener('change', updateRoutesDisplay);
  
  // Theme toggle
  themeButton.addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  
  // Update theme icon
  const themeIcon = themeButton.querySelector('i');
  if (document.body.classList.contains('dark-theme')) {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

/**
 * Show a modal
 * @param {HTMLElement} modal - The modal element to show
 */
function showModal(modal) {
  modal.classList.add('show');
  
  // If it's the route modal, update city dropdowns
  if (modal === addRouteModal) {
    updateRouteFormDropdowns();
  }
}

/**
 * Hide a modal
 * @param {HTMLElement} modal - The modal element to hide
 */
function hideModal(modal) {
  modal.classList.remove('show');
  
  // Reset form
  if (modal === addCityModal) {
    addCityForm.reset();
  } else if (modal === addRouteModal) {
    addRouteForm.reset();
  }
}

/**
 * Handle adding a new city
 * @param {Event} e - Submit event
 */
function handleAddCity(e) {
  e.preventDefault();
  
  const cityName = document.getElementById('city-name').value.trim();
  
  if (cityName) {
    const added = multigrafo.adicionarCidade(cityName);
    
    if (added) {
      renderCities();
      updateFilters();
      hideModal(addCityModal);
      showNotification(`Cidade ${cityName} adicionada com sucesso!`, 'success');
    } else {
      showNotification(`A cidade ${cityName} já existe!`, 'error');
    }
  }
}

/**
 * Handle adding a new route
 * @param {Event} e - Submit event
 */
function handleAddRoute(e) {
  e.preventDefault();
  
  const origem = routeOrigin.value;
  const destino = routeDestination.value;
  const companhia = document.getElementById('route-company').value.trim();
  const horario = document.getElementById('route-time').value;
  const preco = parseFloat(document.getElementById('route-price').value);
  
  if (origem && destino && companhia && horario && !isNaN(preco)) {
    if (origem === destino) {
      showNotification('Origem e destino não podem ser iguais!', 'error');
      return;
    }
    
    const added = multigrafo.adicionarRota(origem, destino, companhia, horario, preco);
    
    if (added) {
      renderRoutes();
      updateFilters();
      hideModal(addRouteModal);
      showNotification(`Rota ${origem} → ${destino} adicionada com sucesso!`, 'success');
    } else {
      showNotification('Erro ao adicionar rota. Verifique os dados.', 'error');
    }
  }
}

/**
 * Render all cities as cards
 */
function renderCities() {
  citiesContainer.innerHTML = '';
  
  const cities = multigrafo.obterCidades();
  
  if (cities.length === 0) {
    citiesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-city"></i>
        <p>Nenhuma cidade cadastrada. Adicione uma cidade para começar.</p>
      </div>
    `;
    return;
  }
  
  cities.forEach(cidade => {
    const numRotas = multigrafo.contarRotas(cidade);
    
    const cityCard = document.createElement('div');
    cityCard.className = 'city-card stagger-item';
    
    cityCard.innerHTML = `
      <div class="icon float">
        <i class="fas fa-building"></i>
      </div>
      <h3 class="city-name">${cidade}</h3>
      <p class="city-routes">
        ${numRotas} rota${numRotas !== 1 ? 's' : ''}
      </p>
    `;
    
    citiesContainer.appendChild(cityCard);
  });
}

/**
 * Update route form dropdowns with current cities
 */
function updateRouteFormDropdowns() {
  routeOrigin.innerHTML = '';
  routeDestination.innerHTML = '';
  
  const cities = multigrafo.obterCidades();
  
  cities.forEach(cidade => {
    const optionOrigin = document.createElement('option');
    optionOrigin.value = cidade;
    optionOrigin.textContent = cidade;
    routeOrigin.appendChild(optionOrigin);
    
    const optionDestination = document.createElement('option');
    optionDestination.value = cidade;
    optionDestination.textContent = cidade;
    routeDestination.appendChild(optionDestination);
  });
  
  // Select different cities by default if possible
  if (cities.length > 1) {
    routeDestination.selectedIndex = 1;
  }
}

/**
 * Update filter dropdowns
 */
function updateFilters() {
  // Get current selected values
  const currentOrigin = filterOrigin.value;
  const currentDestination = filterDestination.value;
  const currentCompany = filterCompany.value;
  
  // Clear dropdowns
  filterOrigin.innerHTML = '<option value="all">Todas as cidades</option>';
  filterDestination.innerHTML = '<option value="all">Todas as cidades</option>';
  filterCompany.innerHTML = '<option value="all">Todas as companhias</option>';
  
  // Add cities to dropdowns
  const cities = multigrafo.obterCidades();
  cities.forEach(cidade => {
    const optionOrigin = document.createElement('option');
    optionOrigin.value = cidade;
    optionOrigin.textContent = cidade;
    filterOrigin.appendChild(optionOrigin);
    
    const optionDestination = document.createElement('option');
    optionDestination.value = cidade;
    optionDestination.textContent = cidade;
    filterDestination.appendChild(optionDestination);
  });
  
  // Add companies to dropdown
  const companies = multigrafo.obterCompanhias();
  companies.forEach(companhia => {
    const option = document.createElement('option');
    option.value = companhia;
    option.textContent = companhia;
    filterCompany.appendChild(option);
  });
  
  // Restore selected values if they still exist
  if (cities.includes(currentOrigin)) {
    filterOrigin.value = currentOrigin;
  }
  
  if (cities.includes(currentDestination)) {
    filterDestination.value = currentDestination;
  }
  
  if (companies.includes(currentCompany)) {
    filterCompany.value = currentCompany;
  }
}

/**
 * Render routes based on current filters
 */
function renderRoutes() {
  updateRoutesDisplay();
}

/**
 * Update routes display based on filters
 */
function updateRoutesDisplay() {
  const origem = filterOrigin.value;
  const destino = filterDestination.value;
  const companhia = filterCompany.value;
  
  const filteredRoutes = multigrafo.filtrarRotas(origem, destino, companhia);
  
  routesContainer.innerHTML = '';
  
  if (filteredRoutes.length === 0) {
    routesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-road"></i>
        <p>Nenhuma rota encontrada com os filtros selecionados.</p>
      </div>
    `;
    return;
  }
  
  filteredRoutes.forEach(rota => {
    const routeCard = document.createElement('div');
    routeCard.className = 'route-card stagger-item';
    
    routeCard.innerHTML = `
      <div class="route-info">
        <div class="route-cities">
          <span>${rota.origem}</span>
          <span class="route-arrow"><i class="fas fa-arrow-right"></i></span>
          <span>${rota.destino}</span>
        </div>
        <div class="route-company">
          <i class="fas fa-bus"></i> ${rota.companhia}
        </div>
      </div>
      <div class="route-time">
        <i class="fas fa-clock"></i> ${rota.horario}
      </div>
      <div class="route-price">
        R$ ${rota.preco.toFixed(2)}
      </div>
    `;
    
    routesContainer.appendChild(routeCard);
  });
  
  // Apply animations to the new elements
  applyAnimations();
}

/**
 * Show a notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning)
 */
function showNotification(message, type = 'info') {
  // Check if notification container exists
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type} slide-in-right`;
  
  // Add icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <p>${message}</p>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('slide-out-right');
    
    notification.addEventListener('animationend', () => {
      notification.remove();
      
      // Remove container if empty
      if (notificationContainer.children.length === 0) {
        notificationContainer.remove();
      }
    });
  }, 3000);
}

/**
 * Apply animations to various elements
 */
function applyAnimations() {
  // Add staggered animation classes
  const staggerItems = document.querySelectorAll('.stagger-item');
  staggerItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
    }, index * 100);
  });
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', initUI);

// Add style for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  .notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .notification {
    background-color: var(--card-background);
    border-left: 4px solid var(--primary-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    box-shadow: var(--shadow-md);
    min-width: 300px;
    max-width: 400px;
  }
  
  .notification i {
    font-size: 1.2rem;
  }
  
  .notification p {
    margin: 0;
    flex: 1;
  }
  
  .notification-success {
    border-left-color: var(--success-color);
  }
  
  .notification-success i {
    color: var(--success-color);
  }
  
  .notification-error {
    border-left-color: var(--error-color);
  }
  
  .notification-error i {
    color: var(--error-color);
  }
  
  .notification-warning {
    border-left-color: var(--warning-color);
  }
  
  .notification-warning i {
    color: var(--warning-color);
  }
  
  @keyframes slide-out-right {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .slide-out-right {
    animation: slide-out-right 0.5s ease forwards;
  }
  
  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .empty-state i {
    font-size: 3rem;
    opacity: 0.5;
  }
`;

document.head.appendChild(notificationStyle);