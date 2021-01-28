import request from '@/utils/request';
import { fetchAPI } from '@/utils/graphql';
// import { API_URL } from '@/config/common';

export async function login(data: any) {
  return request.post(`${BASE_URL}/boscenterservice/account/login`, {
    data,
    requestType: 'form',
  });
}

export async function autoLogin() {
  const formData = new FormData();
  formData.append('name', USERNAME);
  formData.append('password', PASSWORD);
  formData.append('appKey', BUILDING_KEY);
  let data = formData;
  return request.post(`${BASE_URL}/boscenterservice/account/login`, {
    data,
    requestType: 'form',
  });
}
