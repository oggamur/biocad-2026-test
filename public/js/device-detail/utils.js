export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    window.location.href = '/error';
    throw error;
  }
}

export const deviceImages = {
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

export function getDeviceImageHTML(imageType) {
  const device = deviceImages[imageType] || {
    name: 'Неизвестное устройство',
    image: '/images/devices/unknown-item.svg',
    fallback: '📱'
  };
  
  return `
    <img 
      src="${device.image}" 
      alt="${device.name}" 
      class="device-detail-icon-img"
      onerror="this.outerHTML='<div class=\\'device-detail-icon\\'>${device.fallback}</div>'"
    />
  `;
}

export function getStateText(state) {
  const states = {
    'free': 'Свободен',
    'busy': 'Занят',
    'work': 'В работе',
    'mine': 'У вас'
  };
  return states[state] || 'Неизвестно';
}

export function showModal(message) {
  const existingModal = document.getElementById('infoModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'infoModal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const modalMessage = document.createElement('p');
  modalMessage.className = 'modal-message';
  modalMessage.textContent = message;
  
  const modalCloseBtn = document.createElement('button');
  modalCloseBtn.className = 'modal-close-btn';
  modalCloseBtn.textContent = 'Закрыть';
  
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(modalCloseBtn);
  modalOverlay.appendChild(modalContent);
  
  document.body.appendChild(modalOverlay);
  
  const escapeHandler = function(e) {
    if (e.key === 'Escape') {
      modalOverlay.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  
  const closeModal = function() {
    modalOverlay.remove();
    document.removeEventListener('keydown', escapeHandler);
  };
  
  modalCloseBtn.addEventListener('click', closeModal);
  
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', escapeHandler);
}
