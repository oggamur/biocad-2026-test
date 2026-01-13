export const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  data: [],
  originalData: [],
  dateSort: null,
  userSort: null,
  workTypeFilter: null,
  initialMinDate: null,
  initialMaxDate: null
};

export const datePickers = {
  startPicker: null,
  endPicker: null
};

export const eventListeners = {
  documentClickHandlers: [],
  cleanup: function() {
    this.documentClickHandlers.forEach(({ element, handler, event }) => {
      element.removeEventListener(event, handler);
    });
    this.documentClickHandlers = [];
  },
  addDocumentListener: function(handler, event = 'click') {
    document.addEventListener(event, handler);
    this.documentClickHandlers.push({ element: document, handler, event });
    return handler;
  },
  removeDocumentListener: function(handler, event = 'click') {
    document.removeEventListener(event, handler);
    this.documentClickHandlers = this.documentClickHandlers.filter(
      item => !(item.handler === handler && item.event === event)
    );
  }
};
