import { paginationState, datePickers, eventListeners } from './state.js';
import { renderTable, renderPagination } from './rendering.js';
import { dateFilterState, formatDateString } from './dateFilter.js';
import { favoritesManager } from '../favorites.js';
import { deviceStatesManager } from '../deviceStates.js';
import { getStateText, showModal } from './utils.js';


export function updateTable() {
  eventListeners.cleanup();
  
  const tableContainer = document.getElementById('tableContainer');
  if (tableContainer) {
    const dateSortHeader = document.getElementById('dateSortHeader');
    const userSortHeader = document.getElementById('userSortHeader');
    const workTypeFilterHeader = document.getElementById('workTypeFilterHeader');
    
    if (dateSortHeader) dateSortHeader.removeAttribute('data-sort-initialized');
    if (userSortHeader) userSortHeader.removeAttribute('data-sort-initialized');
    if (workTypeFilterHeader) workTypeFilterHeader.removeAttribute('data-filter-initialized');
    
    tableContainer.innerHTML = renderTable();
    setupDateSort();
    setupUserSort();
    setupWorkTypeFilter();
  }
  
  const paginationContainer = document.querySelector('.pagination');
  const newPaginationHTML = renderPagination();
  
  if (paginationContainer) {
    if (newPaginationHTML === '') {
      paginationContainer.remove();
    } else {
      paginationContainer.outerHTML = newPaginationHTML;
      setupPagination();
    }
  } else if (newPaginationHTML !== '') {
    const analyticsContent = document.querySelector('.analytics-content');
    if (analyticsContent) {
      analyticsContent.insertAdjacentHTML('beforeend', newPaginationHTML);
      setupPagination();
    }
  }
}

export function setupTabs() {
  const tabs = document.querySelectorAll('.device-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      const content = document.getElementById(targetTab + 'Tab');
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

function resetTimeChips() {
  const chips = document.querySelectorAll('.time-chip');
  chips.forEach(chip => chip.classList.remove('active'));
}

export function setupTimeChips() {
  const chips = document.querySelectorAll('.time-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      
      if (isActive) {
        this.classList.remove('active');
        
        if (datePickers.startPicker && datePickers.endPicker) {
          if (paginationState.initialMinDate && paginationState.initialMaxDate) {
            datePickers.startPicker.setDate(paginationState.initialMinDate, false);
            datePickers.endPicker.setDate(paginationState.initialMaxDate, false);
            
            dateFilterState.startDate = paginationState.initialMinDate;
            dateFilterState.endDate = paginationState.initialMaxDate;
          } else {
            datePickers.startPicker.clear();
            datePickers.endPicker.clear();
            
            dateFilterState.startDate = null;
            dateFilterState.endDate = null;
          }
          
          paginationState.currentPage = 1;
          updateTable();
        }
        return;
      }
      
      chips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const chipText = this.textContent.trim();
      
      const endDate = new Date();
      let startDate = new Date();
      
      switch (chipText) {
        case 'День':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'Неделя':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '2 недели':
          startDate.setDate(startDate.getDate() - 14);
          break;
        case 'Месяц':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3 месяца':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'Полгода':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        default:
          return;
      }
      
      if (datePickers.startPicker && datePickers.endPicker) {
        datePickers.startPicker.setDate(startDate, false);
        datePickers.endPicker.setDate(endDate, false);
        
        dateFilterState.startDate = startDate;
        dateFilterState.endDate = endDate;
        
        paginationState.currentPage = 1;
        updateTable();
      }
    });
  });
}

export function setupPagination() {
  const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
  const itemsPerPageDropdown = document.getElementById('itemsPerPageDropdown');
  const itemsPerPageValue = document.getElementById('itemsPerPageValue');
  
  if (itemsPerPageSelect && itemsPerPageDropdown) {
    itemsPerPageSelect.addEventListener('click', function(e) {
      e.stopPropagation();
      const isVisible = itemsPerPageDropdown.style.display !== 'none';
      
      if (isVisible) {
        itemsPerPageDropdown.style.display = 'none';
        itemsPerPageDropdown.style.maxHeight = '';
        itemsPerPageDropdown.style.overflowY = '';
      } else {
        const rect = itemsPerPageSelect.getBoundingClientRect();
        
        itemsPerPageDropdown.style.position = 'fixed';
        itemsPerPageDropdown.style.top = '-9999px';
        itemsPerPageDropdown.style.left = rect.left + 'px';
        itemsPerPageDropdown.style.width = rect.width + 'px';
        itemsPerPageDropdown.style.display = 'block';
        
        const dropdownHeight = itemsPerPageDropdown.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        if (spaceBelow >= dropdownHeight + 4) {
          itemsPerPageDropdown.style.top = (rect.bottom + 4) + 'px';
          itemsPerPageDropdown.style.bottom = 'auto';
          itemsPerPageDropdown.style.maxHeight = '';
          itemsPerPageDropdown.style.overflowY = '';
        } else if (spaceAbove >= dropdownHeight + 4) {
          itemsPerPageDropdown.style.top = 'auto';
          itemsPerPageDropdown.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
          itemsPerPageDropdown.style.maxHeight = '';
          itemsPerPageDropdown.style.overflowY = '';
        } else {
          itemsPerPageDropdown.style.top = (rect.bottom + 4) + 'px';
          itemsPerPageDropdown.style.bottom = 'auto';
          itemsPerPageDropdown.style.maxHeight = Math.max(spaceBelow - 4, 100) + 'px';
          itemsPerPageDropdown.style.overflowY = 'auto';
        }
        
        const spaceRight = window.innerWidth - rect.left;
        if (spaceRight < rect.width) {
          itemsPerPageDropdown.style.left = Math.max(16, window.innerWidth - rect.width - 16) + 'px';
        } else {
          itemsPerPageDropdown.style.left = Math.max(16, rect.left) + 'px';
        }
      }
    });
    
    const itemsPerPageClickHandler = function(e) {
      if (itemsPerPageDropdown && 
          !itemsPerPageSelect.contains(e.target) && 
          !itemsPerPageDropdown.contains(e.target)) {
        itemsPerPageDropdown.style.display = 'none';
      }
    };
    eventListeners.addDocumentListener(itemsPerPageClickHandler);
    
    const options = itemsPerPageDropdown.querySelectorAll('.pagination-select-option');
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const value = parseInt(this.getAttribute('data-value'));
        paginationState.itemsPerPage = value;
        paginationState.currentPage = 1;
        itemsPerPageValue.textContent = value;
        itemsPerPageDropdown.style.display = 'none';
        updateTable();
      });
    });
  }
  
  const firstPage = document.getElementById('firstPage');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const lastPage = document.getElementById('lastPage');
  
  if (firstPage) {
    firstPage.addEventListener('click', () => {
      paginationState.currentPage = 1;
      updateTable();
    });
  }
  
  if (prevPage) {
    prevPage.addEventListener('click', () => {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updateTable();
      }
    });
  }
  
  if (nextPage) {
    nextPage.addEventListener('click', () => {
      const totalPages = Math.ceil(paginationState.totalItems / paginationState.itemsPerPage);
      if (paginationState.currentPage < totalPages) {
        paginationState.currentPage++;
        updateTable();
      }
    });
  }
  
  if (lastPage) {
    lastPage.addEventListener('click', () => {
      const totalPages = Math.ceil(paginationState.totalItems / paginationState.itemsPerPage);
      paginationState.currentPage = totalPages;
      updateTable();
    });
  }
}

export function setupDateSort() {
  const dateSortHeader = document.getElementById('dateSortHeader');
  const dateSortDropdown = document.getElementById('dateSortDropdown');
  
  if (dateSortHeader && dateSortDropdown && !dateSortHeader.hasAttribute('data-sort-initialized')) {
    dateSortHeader.setAttribute('data-sort-initialized', 'true');
    
    dateSortHeader.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (paginationState.userSort !== null) {
        return;
      }
      
      const isVisible = dateSortDropdown.style.display !== 'none';
      
      const userSortDropdown = document.getElementById('userSortDropdown');
      const workTypeFilterDropdown = document.getElementById('workTypeFilterDropdown');
      if (userSortDropdown) {
        userSortDropdown.style.display = 'none';
        const userSortHeader = document.getElementById('userSortHeader');
        if (userSortHeader) userSortHeader.classList.remove('dropdown-open');
      }
      if (workTypeFilterDropdown) {
        workTypeFilterDropdown.style.display = 'none';
        const workTypeFilterHeader = document.getElementById('workTypeFilterHeader');
        if (workTypeFilterHeader) workTypeFilterHeader.classList.remove('dropdown-open');
      }
      
      if (isVisible) {
        dateSortDropdown.style.display = 'none';
        dateSortHeader.classList.remove('dropdown-open');
      } else {
        const rect = dateSortHeader.getBoundingClientRect();
        dateSortDropdown.style.position = 'fixed';
        dateSortDropdown.style.top = (rect.bottom + 4) + 'px';
        dateSortDropdown.style.left = rect.left + 'px';
        dateSortDropdown.style.width = Math.max(rect.width, 200) + 'px';
        dateSortDropdown.style.display = 'block';
        dateSortHeader.classList.add('dropdown-open');
      }
    });
    
    const dateSortClickHandler = function(e) {
      if (dateSortHeader && !dateSortHeader.contains(e.target) && 
          dateSortDropdown && !dateSortDropdown.contains(e.target)) {
        dateSortDropdown.style.display = 'none';
        dateSortHeader.classList.remove('dropdown-open');
      }
    };
    eventListeners.addDocumentListener(dateSortClickHandler);
    
        const options = dateSortDropdown.querySelectorAll('.sort-dropdown-option');
        options.forEach(option => {
          option.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            paginationState.dateSort = value === 'null' ? null : value;
            if (paginationState.dateSort !== null) {
              paginationState.userSort = null;
            }
            paginationState.currentPage = 1;
            dateSortDropdown.style.display = 'none';
            dateSortHeader.classList.remove('dropdown-open');
            updateTable();
          });
        });
  }
}

export function setupWorkTypeFilter() {
  const workTypeFilterHeader = document.getElementById('workTypeFilterHeader');
  const workTypeFilterDropdown = document.getElementById('workTypeFilterDropdown');
  
  if (workTypeFilterHeader && workTypeFilterDropdown && !workTypeFilterHeader.hasAttribute('data-filter-initialized')) {
    workTypeFilterHeader.setAttribute('data-filter-initialized', 'true');
    
    workTypeFilterHeader.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const isVisible = workTypeFilterDropdown.style.display !== 'none';
      
      const dateSortDropdown = document.getElementById('dateSortDropdown');
      const userSortDropdown = document.getElementById('userSortDropdown');
      if (dateSortDropdown) {
        dateSortDropdown.style.display = 'none';
        const dateSortHeader = document.getElementById('dateSortHeader');
        if (dateSortHeader) dateSortHeader.classList.remove('dropdown-open');
      }
      if (userSortDropdown) {
        userSortDropdown.style.display = 'none';
        const userSortHeader = document.getElementById('userSortHeader');
        if (userSortHeader) userSortHeader.classList.remove('dropdown-open');
      }
      
      if (isVisible) {
        workTypeFilterDropdown.style.display = 'none';
        workTypeFilterHeader.classList.remove('dropdown-open');
      } else {
        const rect = workTypeFilterHeader.getBoundingClientRect();
        workTypeFilterDropdown.style.position = 'fixed';
        workTypeFilterDropdown.style.top = (rect.bottom + 4) + 'px';
        workTypeFilterDropdown.style.left = rect.left + 'px';
        workTypeFilterDropdown.style.width = Math.max(rect.width, 200) + 'px';
        workTypeFilterDropdown.style.display = 'block';
        workTypeFilterHeader.classList.add('dropdown-open');
      }
    });
    
    const workTypeFilterClickHandler = function(e) {
      if (workTypeFilterHeader && !workTypeFilterHeader.contains(e.target) && 
          workTypeFilterDropdown && !workTypeFilterDropdown.contains(e.target)) {
        workTypeFilterDropdown.style.display = 'none';
        workTypeFilterHeader.classList.remove('dropdown-open');
      }
    };
    eventListeners.addDocumentListener(workTypeFilterClickHandler);
    
    const options = workTypeFilterDropdown.querySelectorAll('.sort-dropdown-option');
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const value = this.getAttribute('data-value');
        paginationState.workTypeFilter = value === 'null' ? null : value;
        paginationState.currentPage = 1;
        workTypeFilterDropdown.style.display = 'none';
        workTypeFilterHeader.classList.remove('dropdown-open');
        updateTable();
      });
    });
  }
}

export function setupUserSort() {
  const userSortHeader = document.getElementById('userSortHeader');
  const userSortDropdown = document.getElementById('userSortDropdown');
  
  if (userSortHeader && userSortDropdown && !userSortHeader.hasAttribute('data-sort-initialized')) {
    userSortHeader.setAttribute('data-sort-initialized', 'true');
    
    userSortHeader.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (paginationState.dateSort !== null) {
        return;
      }
      
      const isVisible = userSortDropdown.style.display !== 'none';
      
      const dateSortDropdown = document.getElementById('dateSortDropdown');
      const workTypeFilterDropdown = document.getElementById('workTypeFilterDropdown');
      if (dateSortDropdown) {
        dateSortDropdown.style.display = 'none';
        const dateSortHeader = document.getElementById('dateSortHeader');
        if (dateSortHeader) dateSortHeader.classList.remove('dropdown-open');
      }
      if (workTypeFilterDropdown) {
        workTypeFilterDropdown.style.display = 'none';
        const workTypeFilterHeader = document.getElementById('workTypeFilterHeader');
        if (workTypeFilterHeader) workTypeFilterHeader.classList.remove('dropdown-open');
      }
      
      if (isVisible) {
        userSortDropdown.style.display = 'none';
        userSortHeader.classList.remove('dropdown-open');
      } else {
        const rect = userSortHeader.getBoundingClientRect();
        userSortDropdown.style.position = 'fixed';
        userSortDropdown.style.top = (rect.bottom + 4) + 'px';
        userSortDropdown.style.left = rect.left + 'px';
        userSortDropdown.style.width = Math.max(rect.width, 200) + 'px';
        userSortDropdown.style.display = 'block';
        userSortHeader.classList.add('dropdown-open');
      }
    });
    
    const userSortClickHandler = function(e) {
      if (userSortHeader && !userSortHeader.contains(e.target) && 
          userSortDropdown && !userSortDropdown.contains(e.target)) {
        userSortDropdown.style.display = 'none';
        userSortHeader.classList.remove('dropdown-open');
      }
    };
    eventListeners.addDocumentListener(userSortClickHandler);
    
    const options = userSortDropdown.querySelectorAll('.sort-dropdown-option');
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const value = this.getAttribute('data-value');
        paginationState.userSort = value === 'null' ? null : value;
        if (paginationState.userSort !== null) {
          paginationState.dateSort = null;
        }
        paginationState.currentPage = 1;
        userSortDropdown.style.display = 'none';
        userSortHeader.classList.remove('dropdown-open');
        updateTable();
      });
    });
  }
}

export function setupDateFilters() {
  const startDateInput = document.getElementById('startDatePicker');
  const endDateInput = document.getElementById('endDatePicker');
  
  if (!startDateInput || !endDateInput) return;
  
  let startDateObj = null;
  let endDateObj = null;
  
  if (startDateInput.value) {
    try {
      const [datePart, timePart] = startDateInput.value.split(', ');
      const [day, month, year] = datePart.split('.');
      const [hours, minutes] = timePart.split(':');
      startDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    } catch (e) {
      console.error('Error parsing start date:', e);
    }
  }
  
  if (endDateInput.value) {
    try {
      const [datePart, timePart] = endDateInput.value.split(', ');
      const [day, month, year] = datePart.split('.');
      const [hours, minutes] = timePart.split(':');
      endDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    } catch (e) {
      console.error('Error parsing end date:', e);
    }
  }
  
  datePickers.startPicker = flatpickr(startDateInput, {
    dateFormat: 'd.m.Y, H:i',
    enableTime: true,
    time_24hr: true,
    locale: 'ru',
    allowInput: true,
    defaultDate: startDateObj,
    onChange: function(selectedDates, dateStr) {
      resetTimeChips();
      
      if (selectedDates.length > 0) {
        dateFilterState.startDate = selectedDates[0];
        datePickers.endPicker.set('minDate', selectedDates[0]);
      } else {
        dateFilterState.startDate = null;
        datePickers.endPicker.set('minDate', null);
      }
      paginationState.currentPage = 1;
      updateTable();
    },
    onClose: function(selectedDates, dateStr, instance) {
      if (selectedDates.length === 0 && dateStr === '') {
        dateFilterState.startDate = null;
        datePickers.endPicker.set('minDate', null);
        paginationState.currentPage = 1;
        updateTable();
      }
    }
  });
  
  datePickers.endPicker = flatpickr(endDateInput, {
    dateFormat: 'd.m.Y, H:i',
    enableTime: true,
    time_24hr: true,
    locale: 'ru',
    allowInput: true,
    defaultDate: endDateObj,
    onChange: function(selectedDates, dateStr) {
      resetTimeChips();
      
      if (selectedDates.length > 0) {
        dateFilterState.endDate = selectedDates[0];
      } else {
        dateFilterState.endDate = null;
      }
      paginationState.currentPage = 1;
      updateTable();
    },
    onClose: function(selectedDates, dateStr, instance) {
      if (selectedDates.length === 0 && dateStr === '') {
        dateFilterState.endDate = null;
        paginationState.currentPage = 1;
        updateTable();
      }
    }
  });
  
  if (startDateObj) {
    datePickers.endPicker.set('minDate', startDateObj);
    dateFilterState.startDate = startDateObj;
  }
  if (endDateObj) {
    dateFilterState.endDate = endDateObj;
  }
  
  if (startDateObj || endDateObj) {
    paginationState.currentPage = 1;
    updateTable();
  }
}

export function setupFavoriteIcon() {
  const favoriteIcon = document.querySelector('.favorite-icon');
  
  if (favoriteIcon) {
    favoriteIcon.addEventListener('click', function() {
      const deviceId = this.getAttribute('data-device-id');
      if (!deviceId) return;
      
      const isFavorite = favoritesManager.toggleFavorite(deviceId);
      
      const svg = this.querySelector('svg');
      if (svg) {
        if (isFavorite) {
          svg.setAttribute('fill', 'currentColor');
          svg.removeAttribute('stroke');
          svg.removeAttribute('stroke-width');
          this.classList.add('active');
        } else {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '1.5');
          this.classList.remove('active');
        }
      }
    });
  }
}

export function setupSavePdfBtn() {
  const savePdfBtn = document.querySelector('.save-pdf-btn');
  
  if (savePdfBtn && !savePdfBtn.hasAttribute('data-pdf-initialized')) {
    savePdfBtn.setAttribute('data-pdf-initialized', 'true');
    
    savePdfBtn.addEventListener('click', function() {
      showModal('Этот интерфейс не реализован');
    });
  }
}

export function setupUserSection() {
  const userSection = document.querySelector('.user-section');
  
  if (userSection && !userSection.hasAttribute('data-user-initialized')) {
    userSection.setAttribute('data-user-initialized', 'true');
    userSection.style.cursor = 'pointer';
    
    userSection.addEventListener('click', function() {
      showModal('Этот интерфейс не реализован');
    });
  }
}


export function setupDeviceStateDropdown() {
  const stateDropdown = document.getElementById('deviceStateDropdown');
  const stateDropdownMenu = document.getElementById('stateDropdown');
  
  if (stateDropdown && !stateDropdown.hasAttribute('data-state-initialized')) {
    stateDropdown.setAttribute('data-state-initialized', 'true');
    
    if (!stateDropdown.classList.contains('disabled') && stateDropdownMenu) {
      stateDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const isVisible = stateDropdownMenu.style.display !== 'none';
        
        if (isVisible) {
          stateDropdownMenu.style.display = 'none';
        } else {
          const rect = stateDropdown.getBoundingClientRect();
          stateDropdownMenu.style.position = 'fixed';
          stateDropdownMenu.style.top = (rect.bottom + 4) + 'px';
          stateDropdownMenu.style.left = rect.left + 'px';
          stateDropdownMenu.style.width = Math.max(rect.width, 150) + 'px';
          stateDropdownMenu.style.display = 'block';
        }
      });
      
      const deviceStateClickHandler = function(e) {
        if (stateDropdown && !stateDropdown.contains(e.target) && 
            stateDropdownMenu && !stateDropdownMenu.contains(e.target)) {
          stateDropdownMenu.style.display = 'none';
        }
      };
      eventListeners.addDocumentListener(deviceStateClickHandler);
      
      const options = stateDropdownMenu.querySelectorAll('.state-dropdown-option');
      
      const currentState = deviceStatesManager.getDisplayState(
        stateDropdown.getAttribute('data-device-id'),
        stateDropdown.getAttribute('data-server-state')
      );
      options.forEach(opt => {
        if (opt.getAttribute('data-value') === currentState) {
          opt.classList.add('selected');
        }
      });
      
      options.forEach(option => {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          const deviceId = stateDropdown.getAttribute('data-device-id');
          const serverState = stateDropdown.getAttribute('data-server-state');
          const selectedValue = this.getAttribute('data-value');
          
          if (!deviceId) return;
          
          deviceStatesManager.setState(deviceId, selectedValue === 'free' ? null : selectedValue);
          
          const displayState = deviceStatesManager.getDisplayState(deviceId, serverState);
          const stateText = stateDropdown.querySelector('span');
          if (stateText) {
            stateText.textContent = getStateText(displayState);
          }

          if (displayState === 'mine') {
            stateDropdown.classList.add('state-mine');
          } else {
            stateDropdown.classList.remove('state-mine');
          }

          options.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');
          
          stateDropdownMenu.style.display = 'none';
        });
      });
    }
  }
}
