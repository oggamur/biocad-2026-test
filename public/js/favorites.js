class FavoritesManager {
  constructor() {
    this.favorites = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('deviceFavorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('deviceFavorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  isFavorite(deviceId) {
    return this.favorites.includes(deviceId);
  }

  toggleFavorite(deviceId) {
    if (this.isFavorite(deviceId)) {
      this.favorites = this.favorites.filter(id => id !== deviceId);
    } else {
      this.favorites.push(deviceId);
    }
    this.saveToStorage();
    return this.isFavorite(deviceId);
  }

  addFavorite(deviceId) {
    if (!this.isFavorite(deviceId)) {
      this.favorites.push(deviceId);
      this.saveToStorage();
    }
  }

  removeFavorite(deviceId) {
    this.favorites = this.favorites.filter(id => id !== deviceId);
    this.saveToStorage();
  }

  getAll() {
    return [...this.favorites];
  }
}

export const favoritesManager = new FavoritesManager();
