
const deviceImages = {
  'ventilation': {
    name: 'Рециркуляционная вентиляция',
    image: '/images/devices/ventilation.png',
    fallback: '🌀'
  },
  'osmometer': {
    name: 'Осмометр',
    image: '/images/devices/osmometer.png',
    fallback: '🔬'
  },
  'alkali': {
    name: 'Система щелочи',
    image: '/images/devices/alkali.png',
    fallback: '⚗️'
  },
  'biosafety': {
    name: 'Бокс биологической безопасности',
    image: '/images/devices/biosafety.png',
    fallback: '📦'
  }
};

function getDeviceImage(imageType) {
  const device = deviceImages[imageType] || deviceImages['ventilation'];
  
  return {
    image: device.image,
    fallback: device.fallback,
    name: device.name
  };
}

function renderDeviceImage(imageType, className = 'device-image') {
  const device = getDeviceImage(imageType);
  
  const img = document.createElement('img');
  img.src = device.image;
  img.alt = device.name;
  img.className = className;
  img.onerror = function() {
    this.outerHTML = `<div class="${className}">${device.fallback}</div>`;
  };
  
  return img.outerHTML;
}

function getDeviceImageHTML(imageType, className = 'device-image') {
  const device = getDeviceImage(imageType);
  
  return `
    <img 
      src="${device.image}" 
      alt="${device.name}" 
      class="${className}"
      onerror="this.outerHTML='<div class=\\'${className}\\'>${device.fallback}</div>'"
    />
  `;
}
