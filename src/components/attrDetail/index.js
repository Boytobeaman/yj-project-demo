import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import SectionBlock from '../sectionBlock';
import request from '@/utils/request';
import { SUCCESS_CODE } from '@/utils/const';
import PieChart from '@/components/echart/pieChart';
import './index.scss';

const SpaceUsage = props => {
  const [parkInfo, setPartInfo] = useState({
    area: 0,
  });

  useEffect(() => {}, []);

  return (
    <SectionBlock title="空间使用">
      <div type="flex" justify="space-between" className="small-section-wrap">
        <div className="small-section-item">
          <div>建筑面积</div>
          <div>
            <span>{parkInfo.area}</span>㎡
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default SpaceUsage;
