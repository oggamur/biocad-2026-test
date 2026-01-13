import { deviceStatesManager } from './deviceStates.js';
import { showModal, safeFetch, getBasePath } from './device-detail/utils.js';

const deviceImages = {
  'ventilation': {
    name: 'Рециркуляционная вентиляция',
    image: '/images/devices/ventilation.svg',
    fallback: '🌀'
  },
  'osmometer': {
    name: 'Осмометр',
    image: '/images/devices/osmometer.svg',
    fallback: '🔬'
  },
  'alkali': {
    name: 'Система щелочи',
    image: '/images/devices/unknown-item.svg',
    fallback: '⚗️'
  },
  'biosafety': {
    name: 'Бокс биологической безопасности',
    image: '/images/devices/bio-box.svg',
    fallback: '📦'
  }
};

function getDeviceImageHTML(imageType) {
  const basePath = getBasePath();
  const device = deviceImages[imageType] || {
    name: 'Неизвестное устройство',
    image: '/images/devices/unknown-item.svg',
    fallback: '📱'
  };
  
  const imagePath = `${basePath}${device.image}`;
  
  return `
    <img 
      src="${imagePath}" 
      alt="${device.name}" 
      class="device-image-img"
      onerror="this.outerHTML='<div class=\\'device-image\\'>${device.fallback}</div>'"
    />
  `;
}

document.addEventListener('DOMContentLoaded', async function() {
  const devicesGrid = document.getElementById('devicesGrid');
  
  try {
    const devices = await safeFetch('./api/devices');
    renderDevices(devices);
    
    setupUserSection();
  } catch (error) {
    console.error('Error loading devices:', error);
  }
});

function setupUserSection() {
  const userSection = document.querySelector('.user-section');
  if (userSection) {
    userSection.style.cursor = 'pointer';
    userSection.addEventListener('click', function() {
      showModal('Этот интерфейс не реализован');
    });
  }
}

function renderDevices(devices) {
  const grid = document.getElementById('devicesGrid');
  grid.innerHTML = '';
  
  devices.forEach(device => {
    const card = createDeviceCard(device);
    grid.appendChild(card);
  });
}

function createDeviceCard(device) {
  const card = document.createElement('div');
  card.className = 'device-card';
  
  const displayState = deviceStatesManager.getDisplayState(device.id, device.state);
  const canChange = deviceStatesManager.canChange(device.id, device.state);
  const stateText = getStateText(displayState);
  const stateClass = displayState;
  const stateIcon = getStateIcon(displayState);
  
  card.innerHTML = `
    <div class="device-card-content">
      <div class="device-image">
        ${getDeviceImageHTML(device.image)}
      </div>
      <div class="device-info">
        <div class="device-header">
          <span class="device-id">${device.id}</span>
          <div class="device-state ${stateClass} ${canChange ? 'device-state-clickable' : ''}" data-device-id="${device.id}" data-server-state="${device.state}">
            ${(displayState === 'free' || displayState === 'mine') ? `${stateIcon}<span>${stateText}</span>` : `<span>${stateText}</span>${stateIcon}`}
            ${canChange ? `
              <div class="state-dropdown dashboard-state-dropdown" style="display: none;">
                <div class="state-dropdown-option" data-value="free">Свободен</div>
                <div class="state-dropdown-option" data-value="mine">У вас</div>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="device-name" title="${device.name}">${device.name}</div>
        <div class="device-room">
          <svg class="room-icon" viewBox="0 0 10.667 13.333" fill="currentColor">
            <path d="M5.333 0C2.387 0 0 2.387 0 5.333c0 4 5.333 8 5.333 8s5.333-4 5.333-8C10.667 2.387 8.28 0 5.333 0zm0 7.2c-1.04 0-1.867-.827-1.867-1.867S4.293 3.467 5.333 3.467s1.867.827 1.867 1.867S6.373 7.2 5.333 7.2z"/>
          </svg>
          <span>${device.room}</span>
        </div>
      </div>
    </div>
      <div class="device-events">
      <div class="event-badge alarm">
        <svg class="event-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>${device.alarms}</span>
      </div>
      <div class="event-badge warning">
        <svg class="event-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <span>${device.warnings}</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', function(e) {
    if (e.target.closest('.device-state-clickable') || e.target.closest('.state-dropdown')) {
      return;
    }
    const basePath = getBasePath();
    window.location.href = `${basePath}/device-detail.html?id=${device.id}`;
  });
  
  if (canChange) {
    setupStateDropdown(card);
  }
  
  return card;
}

function setupStateDropdown(card) {
  const stateElement = card.querySelector('.device-state-clickable');
  const dropdown = card.querySelector('.dashboard-state-dropdown');
  
  if (!stateElement || !dropdown) return;
  
  const newStateElement = stateElement.cloneNode(true);
  stateElement.parentNode.replaceChild(newStateElement, stateElement);
  const newDropdown = newStateElement.querySelector('.dashboard-state-dropdown');
  
  if (!newDropdown) return;
  
  newStateElement.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const isVisible = newDropdown.style.display !== 'none';
    
    document.querySelectorAll('.dashboard-state-dropdown').forEach(d => {
      if (d !== newDropdown) d.style.display = 'none';
    });
    
    if (isVisible) {
      newDropdown.style.display = 'none';
    } else {
      const rect = newStateElement.getBoundingClientRect();
      newDropdown.style.position = 'fixed';
      newDropdown.style.top = (rect.bottom + 4) + 'px';
      newDropdown.style.left = rect.left + 'px';
      newDropdown.style.width = Math.max(rect.width, 150) + 'px';
      newDropdown.style.display = 'block';
    }
  });
  
  const outsideClickHandler = function(e) {
    if (!newStateElement.contains(e.target) && !newDropdown.contains(e.target)) {
      newDropdown.style.display = 'none';
    }
  };
  document.addEventListener('click', outsideClickHandler);
  
  const options = newDropdown.querySelectorAll('.state-dropdown-option');
  options.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const deviceId = newStateElement.getAttribute('data-device-id');
      const serverState = newStateElement.getAttribute('data-server-state');
      const selectedValue = this.getAttribute('data-value');
      
      if (!deviceId) return;
      
      document.removeEventListener('click', outsideClickHandler);
      
      deviceStatesManager.setState(deviceId, selectedValue === 'free' ? null : selectedValue);
      
      const newDisplayState = deviceStatesManager.getDisplayState(deviceId, serverState);
      const newStateText = getStateText(newDisplayState);
      const newIcon = getStateIcon(newDisplayState);
      const dropdownHTML = newDropdown.outerHTML;
      
      newStateElement.className = `device-state ${newDisplayState} device-state-clickable`;
      newStateElement.setAttribute('data-device-id', deviceId);
      newStateElement.setAttribute('data-server-state', serverState);
      
      if (newDisplayState === 'free' || newDisplayState === 'mine') {
        newStateElement.innerHTML = `${newIcon}<span>${newStateText}</span>${dropdownHTML}`;
      } else {
        newStateElement.innerHTML = `<span>${newStateText}</span>${newIcon}${dropdownHTML}`;
      }
      
      setupStateDropdown(card);
      
      newDropdown.style.display = 'none';
    });
  });
}

function getStateText(state) {
  const states = {
    'free': 'Свободен',
    'busy': 'Занят',
    'work': 'В работе',
    'mine': 'У вас'
  };
  return states[state] || 'Неизвестно';
}

function getStateIcon(state) {
  if (state === 'free' || state === 'mine') {
    return '<svg class="device-state-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';
  } else if (state === 'work') {
    return '<svg class="device-state-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';
  } else if (state === 'busy') {
    const basePath = getBasePath();
    return `<img src="${basePath}/images/avatar/unknown-avatar.svg" alt="User" class="device-state-avatar">`;
  }
  return '';
}

function getDeviceIcon(imageType) {
  const device = deviceImages[imageType] || deviceImages['ventilation'];
  return device.fallback;
}
