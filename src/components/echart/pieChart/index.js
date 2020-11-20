import React, { useState, useEffect } from 'react';
import echarts from 'echarts';
import { addObjectAttr } from "@/utils/utils"

const PieChart = (props) => {


  useEffect(() => {
    initData()
  }, [props.data]);

  const initData = () => {
    const floorInfoChart = echarts.init(document.getElementById(props.siteId));
    // 绘制图表
    let options = {// 指定图表的配置项和数据
      grid: {
        right: 0,
        top: 0,
        containLabel: true
      },
      calculable: false,
      title: {//标题组件
        text: props.title,
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle: {
          color: '#fff',
          fontFamily: '微软雅黑',
          fontSize: 16,
          marginBottom: 0,
          paddingBottom: 0,
        }
      },
      tooltip: {//提示框组件
        trigger: 'item', //触发类型(饼状图片就是用这个)
        formatter: "{b} : {c} ({d}%)", //提示框浮层内容格式器
        position: 'top',
        extraCssText: "background:linear-gradient(135deg, #25C1E7 0%, rgba(0,210,255,0.00) 100%);",
        textStyle: {
          fontSize: 16
        }
      },
      color: (!!props.pieColor && props.pieColor.length !== 0) ? props.pieColor : ['#F16317', '#FFC21C', '#1FDBFA', '#ffdf6f', '#968ade'],  //手动设置每个图例的颜色
      legend: {//图例组件
        show: true,
        orient: 'vertical',//布局  纵向布局 图例标记居文字的左边 horizontal则反之
        x: 'right',   //x : 'right',图例显示在右边
        y: 'center',
        icon: "circle",
        align: 'left', //设置位置   文字在右，图例在左（图例纵向排列在图表右侧的时候）
        itemWidth: 10,//图例标记的图形宽度
        itemHeight: 10,
        itemGap: 16,
        textStyle: {//图例文字的样式
          fontSize: 12,
          color: '#fff',
          align: "center"
        },

        formatter: (params) => {
          var legendIndex = 0;
          const data = props.data;
          let total = 0;
          data.forEach(function (v, i) {
            if (v.name === params) {
              legendIndex = i;
            }
            total = total + parseFloat(v.value)
          });
          return params + "          " + data[legendIndex].value + "  " + parseInt(data[legendIndex].value / total * 100, 10) + "%";
        }

      },
      series: [ //系列列表
        {
          name: props.name,  //系列名称
          type: 'pie',
          center: ['25%', '50%'], //设置饼的原心坐标 不设置就会默认在中心的位置
          radius: ['45%', '70%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
          itemStyle: {  //图形样式
            normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              label: {  //饼图图形上的文本标签
                show: false  //平常不显示
              },
              labelLine: {     //标签的视觉引导线样式
                show: false  //平常不显示
              },
            },
          },
          data: props.data
        }
      ]
    }
    debugger
    if(props.addOptions){
      options = addObjectAttr(options, props.addOptions)
    }
    floorInfoChart.setOption(options);
  }

  return (
    <div id={props.siteId} style={props.style}></div>
  );
}

export default PieChart;