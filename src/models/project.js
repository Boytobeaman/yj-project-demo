import {
  getAllModelData
} from '../services/projectApi';
import { SUCCESS_CODE } from '../utils/const'

export default {
  namespace: 'project',
  state: {
    allModelData: []
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
    *getAllModelData(data, { call, put, select }) {
      const result = yield call(getAllModelData, data);
      if(result.code === SUCCESS_CODE) {
        yield put({
          type: 'setState',
          data: result.data.data,
          key: 'allModelData',
        });
      }

      return result;
    },
  },
};
