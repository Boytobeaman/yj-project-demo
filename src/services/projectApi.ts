import request from '@/utils/request';

export async function getAllModelData() {
  return request.post(
    `${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/query/uoModelDocument?noRelation=true`,
    {
      data: {
        condition: [
          {
            field: 'parseStatus',
            operator: '==',
            value: '3',
            number: 'false',
            logic: 'And',
          },
        ],
      },
    },
  );
}

//根据 componentKey 查询其对应的物项
export async function tagModelRel(componentKey) {
  return request.get(
    `${BASE_URL}/buildingservice/${BUILDING_KEY}/tagModelRel?componentKey=${componentKey}`,
  );
}

// 根据物项key 查询物项详情
export async function getTagDetails(tagKey) {
  return request.get(
    `${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/entity/tags/${tagKey}?noRelation=true`,
  );
}

//查询物项的属性/属性组信息
export async function getTagAttributes(tagKey) {
  let body = {
    condition: [
      {
        bosclass: 'uoBldStructures',
        alias: 'd1',
        subCondition: [],
      },
      {
        bosclass: 'tags',
        alias: 'tags',
        subCondition: [
          {
            field: '_key',
            operator: '==',
            value: tagKey,
            number: 'false',
          },
        ],
      },
      {
        bosclass: 'uirBldStructureTag',
        alias: 'ut1',
        type: 'relationship',
        from: 'd1',
        to: 'tags',
        subCondition: [],
      },
      {
        bosclass: 'uoAttributes',
        alias: 'd2',
        subCondition: [
          {
            field: 'bosclass',
            operator: '==',
            value: 'uoAttributes',
            number: 'false',
          },
        ],
      },
      {
        bosclass: 'uoAttributeGroups',
        alias: 'd3',
        subCondition: [
          {
            field: 'bosclass',
            operator: '==',
            value: 'uoAttributeGroups',
            number: 'false',
          },
        ],
      },
      {
        bosclass: 'uirAttributeAttributeGroup',
        alias: 'u1',
        type: 'relationship',
        from: 'd2',
        to: 'd3',
        subCondition: [],
      },
      {
        bosclass: 'uirStructureAttribute',
        alias: 'u',
        type: 'relationship',
        from: 'd1',
        to: 'd2',
        subCondition: [
          {
            field: 'type',
            operator: '==',
            value: 'data',
            number: 'false',
          },
        ],
      },
    ],
    select: {
      name: 'd2.name',
      key: 'd2._key',
      order: 'd2.order',
      source: 'u.source',
      type: 'u.type',
      groupName: 'd3.name',
      groupKey: 'd3._key',
      groupOldKey: 'd3._key',
      require: 'd2.require',
      primary: 'd2.primary',
      value: 'd2.value',
      bosclass: 'd2.bosclass',
    },
  };
  return request.post(
    `${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/linked/query`,
    { data: JSON.stringify(body) },
  );
}

// 根据 tagKey 获取其对应的树节点
export async function getTagTreeNodeKey(tagKey) {
  let body = {
    condition: [
      {
        bosclass: 'uoBldStructures',
        alias: 'd1',
        subCondition: [],
      },
      {
        bosclass: 'tags',
        alias: 'd2',
        subCondition: [
          {
            field: '_key',
            operator: '==',
            logic: 'or',
            value: tagKey,
            number: 'false',
          },
        ],
      },
      {
        bosclass: 'uirBldStructureTag',
        alias: 'u',
        type: 'relationship',
        from: 'd1',
        to: 'd2',
      },
    ],
    select: {
      uoBldStructuresKey: 'd1._key',
    },
  };

  return request.post(
    `${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/linked/query`,
    { data: JSON.stringify(body) },
  );
}

//根据物项key 及其所属的树节点查询物项的 iot 实时数据
export async function getUpdatedIOTData(tagTreeNodeKey, activeTagKey) {
  let body = {
    condition: [
      {
        bosclass: 'uoBldStructures',
        alias: 'd1',
        subCondition: [
          {
            field: '_key',
            operator: '==',
            value: tagTreeNodeKey,
            number: 'false',
          },
        ],
      },
      {
        bosclass: 'tags',
        alias: 'd2',
        subCondition: [
          {
            field: '_key',
            operator: '==',
            value: activeTagKey,
            number: 'false',
            logic: 'AND',
          },
        ],
        nestOr: [],
      },
      {
        bosclass: 'uirBldStructureTag',
        alias: 'u1',
        type: 'relationship',
        from: 'd1',
        to: 'd2',
        subCondition: [],
      },
    ],
    select: {
      name: 'd2.name',
      key: 'd2._key',
      iot: 'd2.iot',
      attribute: 'd2.basicAttribute',
      code: 'd2.code',
      leftCode: 'd1.code',
      leftName: 'd1.name',
      leftKey: 'd1._key',
      relBosclass: 'u1.bosclass',
      type: 'u1.type',
      componentKey: 'd2.componentKey',
    },
    sort: [
      {
        sortBy: 'd2.code',
        order: 'desc', //desc、asc
      },
    ],
    channel: 'haike',
  };
  return request.post(
    `${BASE_URL}/buildingservice/${BUILDING_KEY}/iot-point/query?page=1&per_page=10`,
    { data: JSON.stringify(body) },
  );
}

// 根据物项key 查询物项关联的文档

//根据物项key 查询物项关联的自定义数据

//根据物项key  查询物项关联的物项
