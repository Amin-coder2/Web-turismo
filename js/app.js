'use strict';

// Datos de ejemplo: son ficticios y se mantienen en este archivo local.
const excursions = {
  saona: {
    name: 'Isla Saona',
    destination: 'Bayahibe · Parque Nacional Cotubanamá',
    duration: '8 horas',
    price: 'RD$ 3,500',
    meeting: 'Muelle de Bayahibe'
  },
  limon: {
    name: 'Salto El Limón',
    destination: 'Samaná · Costa nordeste',
    duration: '6 horas',
    price: 'RD$ 2,800',
    meeting: 'Entrada de El Limón'
  },
  colonial: {
    name: 'Santo Domingo Colonial',
    destination: 'Santo Domingo · Ciudad Colonial',
    duration: '5 horas',
    price: 'RD$ 2,200',
    meeting: 'Parque Colón'
  }
};

const selectButtons = document.querySelectorAll('[data-select]');
const excursionCards = document.querySelectorAll('[data-excursion-card]');
const clearButton = document.querySelector('#clear-selection');
const emptyState = document.querySelector('#selection-empty');
const detailsState = document.querySelector('#selection-details');
const selectedName = document.querySelector('#selected-name');
const selectedDestination = document.querySelector('#selected-destination');
const selectedDuration = document.querySelector('#selected-duration');
const selectedPrice = document.querySelector('#selected-price');
const selectedMeeting = document.querySelector('#selected-meeting');
const selectionStatus = document.querySelector('#selection-status');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

let selectedExcursionId = null;

function selectExcursion(excursionId) {
  const excursion = excursions[excursionId];

  if (!excursion) {
    selectionStatus.textContent = 'No se pudo encontrar la excursión seleccionada.';
    return;
  }

  selectedExcursionId = excursionId;
  selectedName.textContent = excursion.name;
  selectedDestination.textContent = excursion.destination;
  selectedDuration.textContent = excursion.duration;
  selectedPrice.textContent = excursion.price;
  selectedMeeting.textContent = excursion.meeting;

  emptyState.hidden = true;
  detailsState.hidden = false;
  clearButton.disabled = false;

  excursionCards.forEach((card) => {
    const isSelected = card.dataset.excursionCard === excursionId;
    card.classList.toggle('is-selected', isSelected);
    const button = card.querySelector('[data-select]');
    button.setAttribute('aria-pressed', String(isSelected));
    button.textContent = isSelected ? 'Seleccionada ✓' : 'Seleccionar →';
  });

  selectionStatus.textContent = `Seleccionaste ${excursion.name}. El resumen está actualizado.`;
}

function clearSelection(announce = true) {
  selectedExcursionId = null;
  emptyState.hidden = false;
  detailsState.hidden = true;
  clearButton.disabled = true;

  excursionCards.forEach((card) => {
    card.classList.remove('is-selected');
    const button = card.querySelector('[data-select]');
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Seleccionar →';
  });

  selectionStatus.textContent = announce
    ? 'Selección limpiada. Todavía no has seleccionado una excursión.'
    : 'Ninguna excursión seleccionada.';
}

selectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectExcursion(button.dataset.select);
  });
});

clearButton.addEventListener('click', clearSelection);

// Menú móvil accesible: el estado se comunica mediante aria-expanded.
function closeMenu(returnFocus = false) {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  primaryNav.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  window.matchMedia('(min-width: 960px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

// Mantener el estado inicial explícito al cargar la página.
clearSelection(false);
