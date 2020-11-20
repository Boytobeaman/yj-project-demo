import request from '@/utils/request';
import { API_URL } from '@/config/common';

export async function fetchAPI(query:string, { variables } = {}) {
  return request(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  // const json = await res.json()
  // if (json.errors) {
  //   console.error(json.errors)
  //   throw new Error('Failed to fetch API')
  // }

  // return json.data
}