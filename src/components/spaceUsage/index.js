import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import SectionBlock from '../sectionBlock'
import request from '@/utils/request';
import {SUCCESS_CODE} from '@/utils/const';
import PieChart from "@/components/echart/pieChart"
import './index.scss'

const SpaceUsage = (props) => {

  const [parkInfo, setPartInfo] = useState({
    area: 0,
    enterprises: 0,
    rental: '',
    jobs: 0,
    free: 0,
    used: 0,
    under: 0,
  })

  const getParkInfo = () => {
    let treeNodeKey = 'a8a0ce62378840c79eb3ce96ebc7b517'
    request.post(`${BASE_URL}/bosfoundationservice/${BUILDING_KEY}/prototype/linked/query?page=1&per_page=10`, {
      data:{
        "condition": [{
            "bosclass": "uoCustomDataStructures",
            "alias": "d1",
            "subCondition": [{
                "field": "_key",
                "operator": "==",
                "value": treeNodeKey,
                "number": "false"
            }]
        }, {
            "bosclass": "uoCustomDatas",
            "alias": "d2",
            "subCondition": [],
            "nestOr": []
        }, {
            "bosclass": "uirCustomStructureData",
            "alias": "u1",
            "type": "relationship",
            "from": "d1",
            "to": "d2",
            "subCondition": []
        }],
        "select": {
            "name": "d2.name",
            "key": "d2._key",
            "attribute": "d2.attribute",
            "code": "d2.code"
        },
        "sort": [{
            "sortBy": "d2.code",
            "order": "desc"
        }]
      },
    })
    .then( res => {

      if(res.code === SUCCESS_CODE && res.data.data && res.data.data.length > 0){

        let infoData = res.data.data[0].attribute;
        let newItem={}
        for (let key of Object.keys(infoData)) {
          console.log(key + ": " + infoData[key]);
          switch (key) {
            case "企业数":
              newItem.enterprises = infoData[key]
              break;
            case "建筑面积":
              newItem.area = infoData[key]
            case "出租率":
              newItem.rental = infoData[key]
              break;
            case "就业数":
              newItem.jobs = infoData[key]
              break;
            case "空闲":
              newItem.free = infoData[key]
              break;
            case "已使用":
              newItem.used = infoData[key]
              break;
            case "洽谈中":
              newItem.under = infoData[key]
              break;
            default:
              break;
          }
        }
        
        setPartInfo(newItem)
      }
    })
  }


  useEffect(() => {
    getParkInfo()
  }, []);

  return (
    <SectionBlock
      title="空间使用"
    >
      <div type="flex" justify="space-between" className="small-section-wrap" >
        <div className='small-section-item'>
          <div>建筑面积</div>
          <div><span>{parkInfo.area}</span>㎡</div>
        </div>
        <div className='small-section-item'>
          <div>出租率</div>
          <div><span>{parkInfo.rental.substring(0, parkInfo.rental.length - 1) || 0}</span>%</div>
        </div>
        <div className='small-section-item'>
          <div>企业数</div>
          <div><span>{parkInfo.enterprises}</span>家</div>
        </div>
        <div className='small-section-item'>
          <div>就业数</div>
          <div><span>{parkInfo.jobs}</span>人</div>
        </div>
      </div>
      <div className="chart-wrap" style={{ height: "70%" }}>
        <PieChart
          siteId='spaceUsageChart'
          style={{ width: '100%', height: '100%' }}
          title=''
          data={[{ name: '已使用', value: parseInt(parkInfo.used) }, {
            name: '洽谈中',
            value: parseInt(parkInfo.under)
          }, { name: '空闲   ', value: parseInt(parkInfo.free) }]}
          name=''
          pieColor={["#00B9FF", "#E7A343", "#3FD47D"]}
          addOptions={{
            grid:{
              right: 50
            }
          }}
        />
      </div>
    </SectionBlock>
  );
};

export default SpaceUsage;
