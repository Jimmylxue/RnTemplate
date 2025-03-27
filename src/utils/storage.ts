import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_NAME = 'snow_token';
export const AUTH_USER = 'snow_user';

export const AUTH_USER_Phone = 'snow_user_phone';
export const AUTH_USER_Password = 'snow_user_password';

export async function getAuthToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_NAME);
  return token;
}

export async function setAuthToken(token: string) {
  return await AsyncStorage.setItem(AUTH_TOKEN_NAME, token);
}

export async function removeAuthToken() {
  return await AsyncStorage.removeItem(AUTH_TOKEN_NAME);
}

export async function getAuthUser(): Promise<string | null> {
  const token = await AsyncStorage.getItem(AUTH_USER);
  return token;
}

export async function setAuthUser(userInfo: string) {
  return await AsyncStorage.setItem(AUTH_USER, userInfo);
}

export async function getLoginPhone(): Promise<string | null> {
  const phone = await AsyncStorage.getItem(AUTH_USER_Phone);
  return phone;
}

export async function setLoginPhone(phone: string) {
  return await AsyncStorage.setItem(AUTH_USER_Phone, phone);
}

export async function getLoginPassword(): Promise<string | null> {
  const password = await AsyncStorage.getItem(AUTH_USER_Password);
  return password;
}

export async function setLoginPassword(password: string) {
  return await AsyncStorage.setItem(AUTH_USER_Password, password);
}
