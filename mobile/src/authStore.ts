import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './api';

export async function getToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.token);
}

export async function setToken(token: string) {
  await AsyncStorage.setItem(STORAGE_KEYS.token, token);
}

export async function clearToken() {
  await AsyncStorage.removeItem(STORAGE_KEYS.token);
}
