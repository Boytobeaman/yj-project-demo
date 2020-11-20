import request from '@/utils/request';
import { fetchAPI } from '@/utils/graphql';
// import { API_URL } from '@/config/common';



export async function login(data:any) {
  return request.post(`${BASE_URL}/boscenterservice/account/login`, {
    data,
    requestType: 'form',
  } );
}