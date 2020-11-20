import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import BimModel from "@/components/bimModel"
import SpaceUsage from "@/components/SpaceUsage"
import './index.scss'

const index = (props) => {


  useEffect(() => {
    props.getAllModelData()
      .then( res => {

      })
  }, []);

  return (
    <div className="page-wrap">
      <BimModel />
      <div className="left-section">
        <SpaceUsage />
      </div>
      
      
    </div>
  );
};

const mapStateToProps = ({ loading, project, attributes, login }) => ({
  loading,
  allModelData: project.allModelData,

});

const mapDispatchToProps = dispatch => ({
  
  getAllModelData() {
    return dispatch({
      type: 'project/getAllModelData'
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(index);
