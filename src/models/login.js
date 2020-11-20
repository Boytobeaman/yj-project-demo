import { login } from '../services/loginApi';

export default {
  namespace: 'login',
  state: {
    user: {},
    jwt: '',
    userCompany: {},
  },
  reducers: {
    setState(state, { data, key }) {
      return {
        ...state,
        [key]: data,
      };
    },
  },
  effects: {
    *login(action, { call, put, select }) {
      const result = yield call(login, action.data);
      if (result.code === "SUCCESS") {
        yield put({
          type: 'setState',
          data: result.data.access_token ? result.data.access_token : '',
          key: 'accessToken',
        });
      }
      return result;
    },
  },
};
