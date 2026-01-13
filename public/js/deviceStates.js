class DeviceStatesManager {
  constructor() {
    this.states = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('deviceStates');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading device states from storage:', error);
      return {};
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('deviceStates', JSON.stringify(this.states));
    } catch (error) {
      console.error('Error saving device states to storage:', error);
    }
  }

  getState(deviceId) {
    return this.states[deviceId] || null;
  }

  setState(deviceId, state) {
    if (state === null || state === 'free') {
      delete this.states[deviceId];
    } else {
      this.states[deviceId] = state;
    }
    this.saveToStorage();
  }

  toggleState(deviceId, currentServerState) {
    if (currentServerState === 'busy' || currentServerState === 'work') {
      return currentServerState;
    }

    const currentState = this.getState(deviceId);
    
    if (currentState === 'mine') {
      this.setState(deviceId, 'free');
      return 'free';
    } else {
      this.setState(deviceId, 'mine');
      return 'mine';
    }
  }

  canChange(deviceId, serverState) {
    return serverState === 'free';
  }

  getDisplayState(deviceId, serverState) {
    if (serverState === 'busy' || serverState === 'work') {
      return serverState;
    }
    
    const userState = this.getState(deviceId);
    return userState || 'free';
  }
}

export const deviceStatesManager = new DeviceStatesManager();
