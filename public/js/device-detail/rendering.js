import { getDeviceImageHTML, getStateText } from './utils.js';
import { paginationState } from './state.js';
import { sortData } from './sorting.js';
import { findDateRange, formatDateString } from './dateFilter.js';
import { favoritesManager } from '../favorites.js';
import { deviceStatesManager } from '../deviceStates.js';

export function renderDeviceDetail(device, detailedData) {
  const card = document.getElementById('deviceDetailCard');
  
  card.innerHTML = `
    <div class="device-detail-top">
      <div class="device-detail-header-section">
        <div class="device-detail-icon">${getDeviceImageHTML(device.image)}</div>
        <div class="device-detail-info">
          <div class="device-detail-name-row">
            <h1 class="device-detail-name">${device.name}</h1>
            <div class="device-edit-icon"></div>
          </div>
          <p class="device-detail-id">${device.id}</p>
        </div>
        <div class="device-detail-actions">
          <div class="device-state-dropdown ${deviceStatesManager.canChange(device.id, device.state) ? '' : 'disabled'} ${deviceStatesManager.getDisplayState(device.id, device.state) === 'mine' ? 'state-mine' : ''}" id="deviceStateDropdown" data-device-id="${device.id}" data-server-state="${device.state}">
            ${(() => {
              const displayState = deviceStatesManager.getDisplayState(device.id, device.state);
              return `
                <span>${getStateText(displayState)}</span>
                ${deviceStatesManager.canChange(device.id, device.state) ? `
                  <svg class="device-state-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                  <div class="state-dropdown" id="stateDropdown" style="display: none;">
                    <div class="state-dropdown-option" data-value="free">Свободен</div>
                    <div class="state-dropdown-option" data-value="mine">У вас</div>
                  </div>
                ` : `
                  <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                `}
              `;
            })()}
          </div>
          <div class="favorite-icon ${favoritesManager.isFavorite(device.id) ? 'active' : ''}" data-device-id="${device.id}">
            <svg viewBox="0 0 24 24" fill="${favoritesManager.isFavorite(device.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="device-tabs">
        <div class="device-tab active" data-tab="analytics">
          <div class="device-tab-text">АНАЛИТИКА</div>
        </div>
        <div class="device-tab" data-tab="description">
          <div class="device-tab-text">ОПИСАНИЕ</div>
        </div>
      </div>
    </div>
    <div class="tab-content active" id="analyticsTab">
      ${renderAnalyticsTab(detailedData.analytics)}
    </div>
    <div class="tab-content" id="descriptionTab">
      ${renderDescriptionTab(device, detailedData.description)}
    </div>
  `;
}

export function renderAnalyticsTab(analyticsData) {
  const { minDate, maxDate } = findDateRange(analyticsData);
  const startDateValue = minDate ? formatDateString(minDate) : '';
  const endDateValue = maxDate ? formatDateString(maxDate) : '';
  
  return `
    <div class="analytics-content">
      <div class="date-filters">
        <div class="date-input-group">
          <div class="date-input" id="startDateInput">
            <input type="text" id="startDatePicker" value="${startDateValue}" placeholder="Выберите дату начала" readonly>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clip-path="url(#clip0_1_2152_start)">
                <path d="M13.3333 2.00008H12.6667V0.666748H11.3333V2.00008H4.66666V0.666748H3.33333V2.00008H2.66666C1.93333 2.00008 1.33333 2.60008 1.33333 3.33341V14.0001C1.33333 14.7334 1.93333 15.3334 2.66666 15.3334H13.3333C14.0667 15.3334 14.6667 14.7334 14.6667 14.0001V3.33341C14.6667 2.60008 14.0667 2.00008 13.3333 2.00008ZM13.3333 14.0001H2.66666V5.33342H13.3333V14.0001Z" fill="currentColor" fill-opacity="0.6"/>
              </g>
              <defs>
                <clipPath id="clip0_1_2152_start">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="date-arrow">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
          <div class="date-input" id="endDateInput">
            <input type="text" id="endDatePicker" value="${endDateValue}" placeholder="Выберите дату окончания" readonly>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clip-path="url(#clip0_1_2152_end)">
                <path d="M13.3333 2.00008H12.6667V0.666748H11.3333V2.00008H4.66666V0.666748H3.33333V2.00008H2.66666C1.93333 2.00008 1.33333 2.60008 1.33333 3.33341V14.0001C1.33333 14.7334 1.93333 15.3334 2.66666 15.3334H13.3333C14.0667 15.3334 14.6667 14.7334 14.6667 14.0001V3.33341C14.6667 2.60008 14.0667 2.00008 13.3333 2.00008ZM13.3333 14.0001H2.66666V5.33342H13.3333V14.0001Z" fill="currentColor" fill-opacity="0.6"/>
              </g>
              <defs>
                <clipPath id="clip0_1_2152_end">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="save-pdf-btn">
          <span>Сохранить PDF</span>
          <div class="btn-divider"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </div>
      </div>
      <div class="time-chips">
        <div class="time-chip">День</div>
        <div class="time-chip">Неделя</div>
        <div class="time-chip">2 недели</div>
        <div class="time-chip">Месяц</div>
        <div class="time-chip">3 месяца</div>
        <div class="time-chip">Полгода</div>
      </div>
      <div class="data-table-container" id="tableContainer">
        ${renderTable()}
      </div>
      ${renderPagination()}
    </div>
  `;
}

export function renderDescriptionTab(device, descriptionData) {
  return `
    <div class="description-content">
      <div class="description-item">
        <div class="description-label">ID в ERP (GUID)</div>
        <div class="description-value">${descriptionData.id}</div>
      </div>
      <div class="description-item">
        <div class="description-label">Серийный номер</div>
        <div class="description-value">${descriptionData.serialNumber}</div>
      </div>
      <div class="description-item">
        <div class="description-label">ID в паспорте</div>
        <div class="description-value">${descriptionData.passportId}</div>
      </div>
      <div class="description-item">
        <div class="description-label">EO</div>
        <div class="description-value">${descriptionData.eo}</div>
      </div>
      <div class="description-line"></div>
      <div class="description-item">
        <div class="description-label">Название</div>
        <div class="description-value">${descriptionData.name}</div>
      </div>
      <div class="description-item">
        <div class="description-label">Производитель</div>
        <div class="description-value">${descriptionData.manufacturer}</div>
      </div>
    </div>
  `;
}

export function renderTable() {
  sortData();
  
  const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
  const endIndex = startIndex + paginationState.itemsPerPage;
  const currentPageData = paginationState.data.slice(startIndex, endIndex);
  
  const isDateSortActive = paginationState.dateSort !== null;
  const isUserSortActive = paginationState.userSort !== null;
  const isWorkTypeFilterActive = paginationState.workTypeFilter !== null;
  
  const uniqueWorkTypes = [...new Set(paginationState.originalData.map(item => item.workType))].sort();
  
  if (paginationState.data.length === 0) {
    return `
      <div class="table-empty-message">
        <p>Записей за выбранный временной промежуток не найдено</p>
      </div>
    `;
  }
  
  const isDateSortDisabled = paginationState.userSort !== null;
  const isUserSortDisabled = paginationState.dateSort !== null;

  return `
    <div class="table-header">
      <div class="table-header-cell date-sort-header ${isDateSortDisabled ? 'sort-disabled' : ''}" id="dateSortHeader">
        <span>Дата и время</span>
        <svg viewBox="0 0 24 24" fill="currentColor" class="${isDateSortActive ? 'active-sort' : ''}">
          <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
        </svg>
        <div class="sort-dropdown" id="dateSortDropdown" style="display: none;">
          <div class="sort-dropdown-option" data-value="null">Исходное состояние</div>
          <div class="sort-dropdown-option" data-value="desc">От новых к старым</div>
          <div class="sort-dropdown-option" data-value="asc">От старых к новым</div>
        </div>
      </div>
      <div class="table-header-cell work-type-filter-header" id="workTypeFilterHeader">
        <span>Вид работ</span>
        <svg viewBox="0 0 24 24" fill="currentColor" class="${isWorkTypeFilterActive ? 'active-sort' : ''}">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
        <div class="sort-dropdown" id="workTypeFilterDropdown" style="display: none;">
          <div class="sort-dropdown-option" data-value="null">Все типы</div>
          ${uniqueWorkTypes.map(workType => `
            <div class="sort-dropdown-option" data-value="${workType}" ${paginationState.workTypeFilter === workType ? 'class="selected"' : ''}>${workType}</div>
          `).join('')}
        </div>
      </div>
      <div class="table-header-cell">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span>Дополнительно</span>
      </div>
      <div class="table-header-cell user-sort-header ${isUserSortDisabled ? 'sort-disabled' : ''}" id="userSortHeader">
        <span>Пользователь</span>
        <svg viewBox="0 0 24 24" fill="currentColor" class="${isUserSortActive ? 'active-sort' : ''}">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
        <div class="sort-dropdown" id="userSortDropdown" style="display: none;">
          <div class="sort-dropdown-option" data-value="null">Исходное состояние</div>
          <div class="sort-dropdown-option" data-value="asc">От A до Z</div>
          <div class="sort-dropdown-option" data-value="desc">От Z до A</div>
        </div>
      </div>
    </div>
    ${currentPageData.map(row => `
      <div class="table-row">
        <div class="table-cell">${row.date} / ${row.time}</div>
        <div class="table-cell">${row.workType}</div>
        <div class="table-cell">${row.additional}</div>
        <div class="table-cell"><a href="#">${row.user}</a></div>
      </div>
    `).join('')}
  `;
}

export function renderPagination() {
  if (paginationState.totalItems === 0) {
    return '';
  }
  
  const totalPages = Math.ceil(paginationState.totalItems / paginationState.itemsPerPage);
  const startItem = (paginationState.currentPage - 1) * paginationState.itemsPerPage + 1;
  const endItem = Math.min(paginationState.currentPage * paginationState.itemsPerPage, paginationState.totalItems);
  
  const isFirstPage = paginationState.currentPage === 1;
  const isLastPage = paginationState.currentPage === totalPages || totalPages === 0;
  
  return `
    <div class="pagination">
      <div class="pagination-info">Строк на странице:</div>
      <div class="pagination-select" id="itemsPerPageSelect">
        <span id="itemsPerPageValue">${paginationState.itemsPerPage}</span>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
        <div class="pagination-select-dropdown" id="itemsPerPageDropdown" style="display: none;">
          <div class="pagination-select-option" data-value="5">5</div>
          <div class="pagination-select-option" data-value="10">10</div>
          <div class="pagination-select-option" data-value="20">20</div>
          <div class="pagination-select-option" data-value="50">50</div>
        </div>
      </div>
      <div class="pagination-info">${startItem}-${endItem} из ${paginationState.totalItems}</div>
      <div class="pagination-controls">
        <button class="pagination-btn" id="firstPage" ${isFirstPage ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="currentColor" style="transform: rotate(180deg);">
            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
          </svg>
        </button>
        <button class="pagination-btn" id="prevPage" ${isFirstPage ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="pagination-btn" id="nextPage" ${isLastPage ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        <button class="pagination-btn" id="lastPage" ${isLastPage ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}
