export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};


export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting from localStorage: ${error}`);
    return defaultValue;
  }
};


export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};

export const clearAllHiveData = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('hive_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
};

export const STORAGE_KEYS = {
  ROOMMATES: 'hive_roommates',
  CART_ITEMS: 'hive_cart_items',
  RENT_ITEMS: 'hive_rent_items',
  AUTO_SHARES: 'hive_auto_shares',
  GAME_PARTNERS: 'hive_game_partners',
  USER_PROFILE: 'hive_user_profile'
};
