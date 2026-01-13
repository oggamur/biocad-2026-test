import { paginationState } from './state.js';
import { filterDataByDateRange, parseDateString } from './dateFilter.js';
import { dateFilterState } from './dateFilter.js';

function parseDate(dateStr, timeStr) {
  return parseDateString(dateStr, timeStr);
}

export function sortData() {
  let filtered = [...paginationState.originalData];
  
  if (dateFilterState.startDate || dateFilterState.endDate) {
    filtered = filterDataByDateRange(
      filtered,
      dateFilterState.startDate,
      dateFilterState.endDate
    );
  }
  
  if (paginationState.workTypeFilter !== null) {
    filtered = filtered.filter(item => item.workType === paginationState.workTypeFilter);
  }
  
  if (paginationState.dateSort !== null || paginationState.userSort !== null) {
    filtered.sort((a, b) => {
      let result = 0;
      
      if (paginationState.dateSort !== null) {
        const dateA = parseDate(a.date, a.time);
        const dateB = parseDate(b.date, b.time);
        
        if (!dateA || !dateB) {
          if (!dateA && !dateB) {
            result = 0;
          } else if (!dateA) {
            result = 1;
          } else if (!dateB) {
            result = -1;
          }
        } else {
          result = paginationState.dateSort === 'desc' 
            ? dateB - dateA
            : dateA - dateB;
        }
        
        if (result !== 0) {
          return result;
        }
        if (paginationState.userSort === null) {
          return 0;
        }
      }
      
      if (paginationState.userSort !== null) {
        const userA = (a.user || '').toLowerCase();
        const userB = (b.user || '').toLowerCase();
        
        if (paginationState.userSort === 'asc') {
          return userA.localeCompare(userB);
        } else {
          return userB.localeCompare(userA);
        }
      }
      
      return 0;
    });
  }
  
  paginationState.data = filtered;
  paginationState.totalItems = filtered.length;
}
