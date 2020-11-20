import React, { useState, useEffect } from 'react';
import { Button, Badge, Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const index = (props) => {

  
  const initialViewer3D = () =>{
    const option = {host: BASE_3D_URL, viewport: "viewport"};
    const viewer3D = new BOS3D.Viewer(option);

    const bos3dui = new BOS3DUI({
      viewer3D: viewer3D,
      BOS3D: BOS3D,
      // 可选，需要显示哪些工具栏。默认都是true
      funcOption: {
          init: false, // 初始化
          // fit: false, // 聚焦
          // undo: false, // 撤销
          // roam: false, // 漫游
          // pickByRect: false, // 框选
          // hide: false, // 隐藏
          // isolate: false, // 构件隔离
          // section: false, // 剖切
          // wireFrame: false, // 线框化
          // scatter: false, // 模型分解
          // changeCptColor: false, // 构件变色
          // setting: false, // 设置
          // fullScreen: false, // 全屏
          // changeBgColor: false, // 改变背景色
          // cptInfo: false, // 构件信息
          // infoTree: false, // 结构树
          // measure: false, // 测量
          // mark: false, // 标签
          // snapshot: false, // 快照
          // annotation: false, // 批注
        }
    });

    window.viewer3D = viewer3D;
    viewer3D.addView("M1597740887240", BOS3D_DATABASE_KEY);
    viewer3D.setSceneBackGroundColor("#00ff00", 0); //设置背景色
    viewer3D.disableViewController(); //隐藏右上角 控制方块
  }

  useEffect(() => {
    initialViewer3D()
  }, []);
  
  return (
    <div id="viewport" style={{height: "100%", width:"100%"}}></div>
  );
};

export default index;
