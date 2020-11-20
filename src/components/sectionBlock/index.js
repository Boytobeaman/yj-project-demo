import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import './index.scss'

const SectionBlock = (props) => {

  return (
    <div className='section-block-wrap'>
      <div className='section-block-bg'>
        <div className='section-block-title'>
          <div>{props.title}</div>
        </div>
        <div className='section-block-content'>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default SectionBlock;
