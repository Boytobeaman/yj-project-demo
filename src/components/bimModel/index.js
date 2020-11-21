import React, { useState, useEffect } from 'react';
import { Button, Badge, Popconfirm, Table } from 'antd';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
  tagModelRel,
  getTagDetails,
  getTagAttributes,
  getTagTreeNodeKey,
  getUpdatedIOTData,
} from '../../services/projectApi';
// import ItemDataAttribute from './ItemDataAttribute';

import './index.scss';

import AttrDetail from '@/components/attrDetail';

let updateIOTDataInterval = null;

const index = props => {
  const [showAttr, setShowAttr] = useState(false);

  const [iotData, setIotData] = useState([]);
  const [activeGroupedTagAttributes, setActiveGroupedTagAttributes] = useState(
    [],
  );
  const [deviceName, setDeviceName] = useState('');

  const [activeComponentKey, setActiveComponentKey] = useState('');
  const [activeTagKey, setActiveTagKey] = useState('');
  const [activeTreeNodeKey, setActiveTreeNodeKey] = useState('');

  const resetData = () => {
    setActiveComponentKey('');
    setActiveTagKey('');
    setActiveTreeNodeKey('');
  };

  const getAttrIOTData = (groupName, groupedTagAttributes, tagDetail) => {
    let thisAttr = groupedTagAttributes[groupName];
    let nameAndValues = [];
    thisAttr.forEach(attr => {
      let name = attr.name;
      let value = tagDetail[name] ? tagDetail[name] : '';
      nameAndValues.push({
        name,
        key: attr.name,
        value,
      });
    });
    return nameAndValues;
  };

  const getIOTdata = async selectedObjectId => {
    let bindedTagRes = await tagModelRel(selectedObjectId);
    let bindedTag;
    if (bindedTagRes && bindedTagRes.data && bindedTagRes.data.length > 0) {
      bindedTag = bindedTagRes.data[0];
      let tagKey = bindedTag.tagKey;
      setActiveTagKey(tagKey);
      console.log(`tagkey == ${tagKey}`);
      if (tagKey === '39a3776fe88b457cac00281555e68a04') {
        setDeviceName(1);
      }
      if (tagKey === '424d2820533b4cdfbe671f89382d5891') {
        setDeviceName(2);
      }
      if (tagKey === 'ab2c074023da434ebd0e38dbb425b7b3') {
        setDeviceName(3);
      }

      let tagDetailRes = await getTagDetails(tagKey);
      let tagDetail = {};
      if (tagDetailRes.code === 'SUCCESS') {
        tagDetail = tagDetailRes.data.basicAttribute;
      }
      let tagAttributesRes = await getTagAttributes(tagKey);
      let tagAttributes;
      if (tagAttributesRes.code === 'SUCCESS') {
        tagAttributes = tagAttributesRes.data.data;

        let groupedTagAttributes = _.groupBy(tagAttributes, item => {
          return item.groupName;
        });

        setActiveGroupedTagAttributes(groupedTagAttributes);

        let iotData = getAttrIOTData(
          'IoT数据',
          groupedTagAttributes,
          tagDetail,
        );

        setIotData(iotData);
        setShowAttr(true);

        let tagTreeNodeKeyRes = await getTagTreeNodeKey(tagKey);
        let tagTreeNodeKey = '';
        if (tagTreeNodeKeyRes && tagTreeNodeKeyRes.code === 'SUCCESS') {
          tagTreeNodeKey =
            tagTreeNodeKeyRes.data.data.length > 0
              ? tagTreeNodeKeyRes.data.data[0].uoBldStructuresKey
              : '';
        }
        setActiveTreeNodeKey(tagTreeNodeKey);
        console.log(`activeTreeNodeKey 1 ====${activeTreeNodeKey}`);
      }
    } else {
      setShowAttr(false);
      resetData();
    }
  };

  const initialViewer3D = () => {
    const option = { host: BASE_3D_URL, viewport: 'viewport' };
    const viewer3D = new BOS3D.Viewer(option);

    const bos3dui = new BOS3DUI({
      viewer3D: viewer3D,
      BOS3D: BOS3D,
      // 可选，需要显示哪些工具栏。默认都是true
      funcOption: {
        init: false, // 初始化
        fit: false, // 聚焦
        undo: false, // 撤销
        roam: false, // 漫游
        pickByRect: false, // 框选
        hide: false, // 隐藏
        isolate: false, // 构件隔离
        section: false, // 剖切
        wireFrame: false, // 线框化
        scatter: false, // 模型分解
        changeCptColor: false, // 构件变色
        setting: false, // 设置
        fullScreen: false, // 全屏
        changeBgColor: false, // 改变背景色
        cptInfo: false, // 构件信息
        infoTree: false, // 结构树
        measure: false, // 测量
        mark: false, // 标签
        snapshot: false, // 快照
        annotation: false, // 批注
      },
    });

    window.viewer3D = viewer3D;
    let modelKey = 'M1605848728028';
    viewer3D.addView(modelKey, BOS3D_DATABASE_KEY);
    viewer3D.setSceneBackGroundColor('#00ff00', 0); //设置背景色
    viewer3D.disableViewController(); //隐藏右上角 控制方块

    window.viewer3D.registerModelEventListener(
      window.BOS3D.EVENTS.ON_CLICK_PICK,
      async event => {
        // console.log(event, "-----");

        if (event.intersectInfo) {
          let selectedObjectId = event.intersectInfo.selectedObjectId;
          if (updateIOTDataInterval) {
            clearInterval(updateIOTDataInterval);
            updateIOTDataInterval = null;
          }
          console.log('a', '-----');
          getIOTdata(selectedObjectId);
          setActiveComponentKey(selectedObjectId);
        } else {
          setShowAttr(false);
          resetData();
        }
      },
    );
  };

  const updateIOTData = () => {
    console.log(`trigger updateIOTData`);
    console.log(`activeTreeNodeKey ${activeTreeNodeKey}`);
    console.log(`activeTagKey ${activeTagKey}`);

    if (activeTreeNodeKey && activeTagKey) {
      if (updateIOTDataInterval) {
        clearInterval(updateIOTDataInterval);
        updateIOTDataInterval = null;
      }

      updateIOTDataInterval = setInterval(async () => {
        let updateRes = await getUpdatedIOTData(
          activeTreeNodeKey,
          activeTagKey,
        );

        if (updateRes.code === 'SUCCESS' && updateRes.data.data.length > 0) {
          let tagDetail = updateRes.data.data[0].attribute;
          let iotData = getAttrIOTData(
            'IoT数据',
            activeGroupedTagAttributes,
            tagDetail,
          );
          setIotData(iotData);
        }
      }, 1000);
    } else {
      if (updateIOTDataInterval) {
        clearInterval(updateIOTDataInterval);
        updateIOTDataInterval = null;
      }
    }
  };

  useEffect(() => {
    initialViewer3D();
  }, []);

  useEffect(() => {
    updateIOTData();
  }, [activeTreeNodeKey]);

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'age',
    },
  ];

  return (
    <>
      <div id="viewport" style={{ height: '100%', width: '100%' }}></div>
      {showAttr && (
        <div className="attr-wrapper">
          <h3 style={{ textAlign: 'center', color: '#fff' }}>
            {deviceName} 号低压配电柜运行状态{' '}
          </h3>
          <Table
            dataSource={iotData}
            showHeader={false}
            size="small"
            scroll={{ y: '70vh' }}
            columns={columns}
            pagination={false}
          />
        </div>
      )}
    </>
  );
};

export default index;
