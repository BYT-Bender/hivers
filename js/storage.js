const STORAGE_KEYS = {
  USER_PROFILE: 'hive-user-profile',
  RENT_ITEMS: 'hive-rent-items',
  CART_ITEMS: 'hive-cart-items',
  AUTO_SHARES: 'hive-auto-shares',
  GAME_PARTNERS: 'hive-game-partners',
  GAME_PROFILE: 'hive-game-profile'
};

function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

function clearFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing from localStorage:', error);
  }
}
