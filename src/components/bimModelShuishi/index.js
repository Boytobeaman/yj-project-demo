import React, { useState, useEffect } from 'react';
import { Button, Badge, Popconfirm, Table, message } from 'antd';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
  getUpdatedIOTData,
  getComponentsByModelkey,
  getBatchComponentsAttrs,
} from '../../services/projectApi';
import { autoLogin } from '../../services/loginApi';
// import ItemDataAttribute from './ItemDataAttribute';

import './index.scss';

import AttrDetail from '@/components/attrDetail';

let updateIOTDataInterval = null;

const modelKey = 'M1611816746024';

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + 'header')) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const index = props => {
  const [showAttr, setShowAttr] = useState(false);

  const [iotData, setIotData] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [gettingComponentsData, setGettingComponentsData] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  // const getIOTdata = async selectedObjectId => {
  //   let bindedTagRes = await tagModelRel(selectedObjectId);
  //   let bindedTag;
  //   if (bindedTagRes && bindedTagRes.data && bindedTagRes.data.length > 0) {
  //     bindedTag = bindedTagRes.data[0];
  //     let tagKey = bindedTag.tagKey;
  //     setActiveTagKey(tagKey);
  //     console.log(`tagkey == ${tagKey}`);
  //     if (tagKey === '884de4c31a5441399aebd9e7bd0871b6') {
  //       setDeviceName(1);
  //     }
  //     if (tagKey === '1fa7cbcd55d443168182b0447a216eaf') {
  //       setDeviceName(2);
  //     }
  //     if (tagKey === '3aa9e478997c4347bd708883b482f20b') {
  //       setDeviceName(3);
  //     }

  //     let tagDetailRes = await getTagDetails(tagKey);
  //     let tagDetail = {};
  //     if (tagDetailRes.code === 'SUCCESS') {
  //       tagDetail = tagDetailRes.data.basicAttribute;
  //     }
  //     let tagAttributesRes = await getTagAttributes(tagKey);
  //     let tagAttributes;
  //     if (tagAttributesRes.code === 'SUCCESS') {
  //       tagAttributes = tagAttributesRes.data.data;

  //       let groupedTagAttributes = _.groupBy(tagAttributes, item => {
  //         return item.groupName;
  //       });

  //       setActiveGroupedTagAttributes(groupedTagAttributes);

  //       let iotData = getAttrIOTData(
  //         'IoT数据',
  //         groupedTagAttributes,
  //         tagDetail,
  //       );

  //       setIotData(iotData);
  //       setShowAttr(true);

  //       let tagTreeNodeKeyRes = await getTagTreeNodeKey(tagKey);
  //       let tagTreeNodeKey = '';
  //       if (tagTreeNodeKeyRes && tagTreeNodeKeyRes.code === 'SUCCESS') {
  //         tagTreeNodeKey =
  //           tagTreeNodeKeyRes.data.data.length > 0
  //             ? tagTreeNodeKeyRes.data.data[0].uoBldStructuresKey
  //             : '';
  //       }
  //       setActiveTreeNodeKey(tagTreeNodeKey);
  //       console.log(`activeTreeNodeKey 1 ====${activeTreeNodeKey}`);
  //     }
  //   } else {
  //     setShowAttr(false);
  //     resetData();
  //   }
  // };

  const initialViewer3D = () => {
    // const option = { host: BASE_3D_URL, viewport: 'viewport' };
    // const viewer3D = new BOS3D.Viewer(option);

    const linkage = new Linkage({
      BOS3D: window.BOS3D,
      BOS2D: window.BOS2D,
      BOS3DUI: window.BOS3DUI,
      selector: '#viewport', // 插件会插入到这个dom内部
      host: BASE_3D_URL, // 对应viewer3D初始化参数里的host
      token: '',
      onInitComplete: () => {
        // 由于涉及到异步初始化，如果想在一开始就获取到如下实例，需要用这个方法
        console.log(
          'test: ',
          linkage.viewer3D,
          linkage.viewer2D,
          linkage.bos3dui,
        );
        // const bos3dui = new BOS3DUI({
        //   viewer3D: linkage.viewer3D,
        //   BOS3D: BOS3D,
        //   // 可选，需要显示哪些工具栏。默认都是true
        //   funcOption: {
        //     // init: false, // 初始化
        //     // fit: false, // 聚焦
        //     // undo: false, // 撤销
        //     // roam: false, // 漫游
        //     // pickByRect: false, // 框选
        //     // hide: false, // 隐藏
        //     // isolate: false, // 构件隔离
        //     // section: false, // 剖切
        //     // wireFrame: false, // 线框化
        //     // scatter: false, // 模型分解
        //     // changeCptColor: false, // 构件变色
        //     // setting: false, // 设置
        //     // fullScreen: false, // 全屏
        //     // changeBgColor: false, // 改变背景色
        //     // cptInfo: false, // 构件信息
        //     // infoTree: false, // 结构树
        //     // measure: false, // 测量
        //     // mark: false, // 标签
        //     // snapshot: false, // 快照
        //     // annotation: false, // 批注
        //   },
        // });

        window.viewer3D = linkage.viewer3D;

        viewer3D.setSceneBackGroundColor('#00ff00', 0); //设置背景色
        viewer3D.disableViewController(); //隐藏右上角 控制方块

        window.viewer3D.registerModelEventListener(
          window.BOS3D.EVENTS.ON_CLICK_PICK,
          async event => {
            // console.log(event, "-----");

            if (event.intersectInfo) {
              let selectedObjectId = event.intersectInfo.selectedObjectId;
              // if (updateIOTDataInterval) {
              //   clearInterval(updateIOTDataInterval);
              //   updateIOTDataInterval = null;
              // }
              // console.log('a', '-----');
              // getIOTdata(selectedObjectId);
              setActiveComponentKey(selectedObjectId);
              setSelectedRowKeys([selectedObjectId]);
            } else {
              setShowAttr(false);
              resetData();
            }
          },
        );
      },
    });

    linkage.addView(modelKey, BOS3D_DATABASE_KEY);
  };

  const getComponentsData = async () => {
    setGettingComponentsData(true);
    let components = await getComponentsByModelkey(modelKey);
    if (components && components.data && components.data.length > 0) {
      let componentsAttrs = await getBatchComponentsAttrs(
        components.data,
        'name,key,attribute.绝缘层.隔热层厚度,attribute.约束.顶部高程,attribute.机械.粗糙度',
      );
      console.log(componentsAttrs.data);
      setGettingComponentsData(false);
      if (componentsAttrs && componentsAttrs.data) {
        setComponentsData(componentsAttrs.data);
      }
    } else {
      message.warning(`没有找到模型 ${modelKey} 的构件`);
      setGettingComponentsData(false);
    }
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

  useEffect(async () => {
    if (!sessionStorage.getItem('accessToken')) {
      let loginRes = await autoLogin();
      if (loginRes && loginRes.data) {
        window.sessionStorage.setItem(
          'accessToken',
          loginRes.data.access_token,
        );
        initialViewer3D();
        getComponentsData();
      }
    } else {
      initialViewer3D();
      getComponentsData();
    }
  }, []);

  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      let selectedElement = document.querySelector(
        '#mydiv .ant-table-row-selected',
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, [selectedRowKeys]);

  useEffect(() => {
    dragElement(document.getElementById('mydiv'));
  }, []);

  useEffect(() => {
    updateIOTData();
  }, [activeTreeNodeKey, activeTagKey]);

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

  const shuishicolumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key > b.key,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '隔热层厚度',
      dataIndex: ['attribute', '绝缘层', '隔热层厚度'],
      key: '隔热层厚度',
      sorter: (a, b) => {
        if (a['attribute']['绝缘层'] && b['attribute']['绝缘层']) {
          if (
            a['attribute']['绝缘层']['隔热层厚度'] &&
            !b['attribute']['绝缘层']['隔热层厚度']
          ) {
            return 1;
          } else if (
            !a['attribute']['绝缘层']['隔热层厚度'] &&
            b['attribute']['绝缘层']['隔热层厚度']
          ) {
            return -1;
          } else if (
            a['attribute']['绝缘层']['隔热层厚度'] &&
            b['attribute']['绝缘层']['隔热层厚度']
          ) {
            return a['attribute']['绝缘层']['隔热层厚度'].localeCompare(
              b['attribute']['绝缘层']['隔热层厚度'],
            );
          }
        } else {
          return 1;
        }
      },
    },
    {
      title: '顶部高程',
      dataIndex: ['attribute', '约束', '顶部高程'],
      key: '顶部高程',
      sorter: (a, b) => {
        if (a['attribute']['约束'] && b['attribute']['约束']) {
          if (
            a['attribute']['约束']['顶部高程'] &&
            !b['attribute']['约束']['顶部高程']
          ) {
            return 1;
          } else if (
            !a['attribute']['约束']['顶部高程'] &&
            b['attribute']['约束']['顶部高程']
          ) {
            return -1;
          } else if (
            a['attribute']['约束']['顶部高程'] &&
            b['attribute']['约束']['顶部高程']
          ) {
            return a['attribute']['约束']['顶部高程'].localeCompare(
              b['attribute']['约束']['顶部高程'],
            );
          }
        } else {
          return 1;
        }
      },
    },
    {
      title: '粗糙度',
      dataIndex: ['attribute', '机械', '粗糙度'],
      key: '粗糙度',
      sorter: (a, b) => {
        if (a['attribute']['机械'] && b['attribute']['机械']) {
          if (
            a['attribute']['机械']['粗糙度'] &&
            !b['attribute']['机械']['粗糙度']
          ) {
            return 1;
          } else if (
            !a['attribute']['机械']['粗糙度'] &&
            b['attribute']['机械']['粗糙度']
          ) {
            return -1;
          } else if (
            a['attribute']['机械']['粗糙度'] &&
            b['attribute']['机械']['粗糙度']
          ) {
            return a['attribute']['机械']['粗糙度'].localeCompare(
              b['attribute']['机械']['粗糙度'],
            );
          }
        } else {
          return 1;
        }
      },
    },
  ];

  const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
      setSelectedRowKeys(selectedRowKeys);
      viewer3D.highlightComponentsByKey(selectedRowKeys);
      // viewer3D.adaptiveSizeByKey(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const designPlan = () => {
    let url = `http://building-bos3d-alpha.rickricks.com:8080/static/index2D.html?dbName=o5fabba65a3c40c4bfeaaa1fabd443f7&modelId=M1605850523549&url=http://building-bos3d-alpha.rickricks.com`;
    window.open(url);
  };

  const pdfPlan = () => {
    let url = `/document/Blokset 5000高可靠性智能低压成套系统 产品目录.pdf`;
    window.open(url);
  };

  return (
    <>
      <div id="viewport" style={{ height: '100%', width: '100%' }}></div>
      {/* {showAttr && (
        <div id="mydiv" className="attr-wrapper">
          <h3 id="mydivheader" style={{ textAlign: 'center', color: '#fff' }}>
            {deviceName} 号低压配电柜运行状态{' '}
          </h3>
          <Table
            dataSource={iotData}
            showHeader={false}
            size="small"
            scroll={{ y: '65vh' }}
            columns={columns}
            pagination={false}
          />
          <div className="btn-wrap">
            <Button type="primary" onClick={designPlan} size="small">
              设计图纸
            </Button>
            <Button type="primary" onClick={pdfPlan} size="small">
              使用说明书
            </Button>
          </div>
        </div>
      )} */}
      <div id="mydiv" className="attr-wrapper">
        <h3 id="mydivheader" style={{ textAlign: 'center', color: '#fff' }}>
          构件列表
        </h3>
        <Table
          dataSource={componentsData}
          // showHeader={false}
          rowSelection={rowSelection}
          loading={gettingComponentsData}
          size="small"
          scroll={{ y: '65vh' }}
          columns={shuishicolumns}
          pagination={false}
        />
      </div>
    </>
  );
};

export default index;
