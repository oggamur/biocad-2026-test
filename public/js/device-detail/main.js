import { safeFetch } from './utils.js';
import { paginationState } from './state.js';
import { renderDeviceDetail } from './rendering.js';
import { setupTabs, setupTimeChips, setupPagination, setupDateSort, setupUserSort, setupWorkTypeFilter, setupDateFilters, setupFavoriteIcon, setupDeviceStateDropdown, setupSavePdfBtn, setupUserSection } from './setup.js';

document.addEventListener('DOMContentLoaded', async function() {
  const deviceDetailCard = document.getElementById('deviceDetailCard');
  const urlParams = new URLSearchParams(window.location.search);
  const deviceId = urlParams.get('id');
  
  if (!deviceId) {
    deviceDetailCard.innerHTML = '<div class="loading">ID устройства не указан.</div>';
    return;
  }
  
  try {
    const devices = await safeFetch('/api/devices');
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
      deviceDetailCard.innerHTML = '<div class="loading">Устройство не найдено.</div>';
      return;
    }
    
    const detailedData = await safeFetch(`/api/detailed-data/${deviceId}`);
    
    paginationState.originalData = [...detailedData.analytics];
    paginationState.data = detailedData.analytics;
    paginationState.totalItems = detailedData.analytics.length;
    paginationState.dateSort = null;
    paginationState.userSort = null;
    
    renderDeviceDetail(device, detailedData);
    
        setTimeout(() => {
          setupTabs();
          setupTimeChips();
          setupPagination();
          setupDateSort();
          setupUserSort();
          setupWorkTypeFilter();
          setupDateFilters();
          setupFavoriteIcon();
          setupDeviceStateDropdown();
          setupSavePdfBtn();
          setupUserSection();
        }, 0);
  } catch (error) {
    console.error('Error loading device:', error);
  }
});
