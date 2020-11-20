import request from '@/utils/request';

export async function getAllModelData() {
  return request.post(`${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/query/uoModelDocument?noRelation=true`, {
    data:{
      "condition": [{
        "field": "parseStatus",
        "operator": "==",
        "value": "3",
        "number": "false",
        "logic": "And"
      }]
    },
  });
}

