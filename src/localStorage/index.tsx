import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocalStorageGet = async (key: string) => {
  console.log('LocalStorageGet running...', key);
  try {
    const storedValue = await AsyncStorage.getItem(key);
    if (storedValue !== null) {
      const parsedValue = JSON.parse(storedValue);
      console.log('get local return ==>', parsedValue);
      return parsedValue;
    } else {
      // Handle the case where the key does not exist in AsyncStorage
      return null;
    }
  } catch (error) {
    console.error('Error loading data from local storage:', error);
    return null;
  }
};

export const LocalStorageSet = async (key: string, value: any) => {
  console.log('LocalStorageSet running...');

  console.log('SetLocal====>', value);
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data to local storage:', error);
  }
};

export const LocalStorageClear = async (key: string) => {
  console.log('LocalStorageClear running...');

  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};

export const LocalStorageClearAll = async () => {
  console.log('LocalStorageClearAll running...');

  try {
    await AsyncStorage.clear();
    console.log('All data cleared from AsyncStorage.');
  } catch (error) {
    console.error('Error clearing data from AsyncStorage:', error);
  }
};
