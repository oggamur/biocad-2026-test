function isValid(date) {
  return date instanceof Date && !isNaN(date);
}

export const dateFilterState = {
  startDate: null,
  endDate: null
};

export function parseDateString(dateStr, timeStr) {
  try {
    const [day, month, year] = dateStr.split('.');
    const [hours, minutes] = timeStr.split(':');
    const fullYear = 2000 + parseInt(year);
    return new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  } catch (error) {
    return null;
  }
}

export function formatDateString(date) {
  if (!date || !isValid(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export function findDateRange(data) {
  if (!data || data.length === 0) {
    return { minDate: null, maxDate: null };
  }
  
  let minDate = null;
  let maxDate = null;
  
  data.forEach(item => {
    const itemDate = parseDateString(item.date, item.time);
    if (itemDate && isValid(itemDate)) {
      if (!minDate || itemDate < minDate) {
        minDate = itemDate;
      }
      if (!maxDate || itemDate > maxDate) {
        maxDate = itemDate;
      }
    }
  });
  
  return { minDate, maxDate };
}

export function filterDataByDateRange(data, startDate, endDate) {
  if (!startDate && !endDate) {
    return data;
  }
  
  return data.filter(item => {
    const itemDate = parseDateString(item.date, item.time);
    if (!itemDate || !isValid(itemDate)) return false;
    
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }
    
    return true;
  });
}
