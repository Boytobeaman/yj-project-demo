export function getTextWidth(
  inputText,
  font = '14px -apple-system, BlinkMacSystemFont',
) {
  // inputText = "Geeks For Geeks";
  // font = "14px SourceHanSansCN-Normal,SourceHanSansCN";

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.font = font;
  let width = context.measureText(inputText).width;
  let formattedWidth = Math.ceil(width);

  return formattedWidth;
}

export const treeSetting = {
  leafIcon: <img src="images/leafIcon.png" style={{ width: '11px' }} />,
  notLeafIcon: <img src="images/notLeafIcon.png" style={{ width: '11px' }} />,
  className: 'hide-file-icon',
  attrbutes: {
    showIcon: true,
    showLine: true,
    blockNode: true,
  },
};

export function getStructureTreeData(data, parentID) {
  let outerArr = [];

  if (parentID) {
    data
      .filter(i => i.parent && i.parent.id === parentID)
      .forEach(i => {
        outerArr.push(i);
        i.children = getStructureTreeData(data, i.id);
      });
  } else {
    data
      .filter(i => !i.parent)
      .forEach(i => {
        outerArr.push(i);
        i.children = getStructureTreeData(data, i.id);
      });
  }

  if (outerArr.length === 0) return null;

  return outerArr;
}

/**
 * 获得一个整数值，这个值是一个大于当前传入值的最近的一个10的倍数的值，比如 2->10，50->60, 61->70
 * param: 当前最大排序
 * return 返回下一个排序值
 */

export function nextOrderNumber(num) {
  if (isNaN(num)) {
    num = 0;
  } else {
    if (typeof num === 'string') {
      num = Number(num);
    }
  }

  return Math.ceil((num + 1) * 0.1) * 10;
}

/**
 *
 * 在原对象中增加属性，如果新对象和原对象的某个属性都是个对象，
 * 不直接替换，而是遍历新对象的属性，递归为原对象增加属性
 * @param {原对象} originalObject
 * @param {要将属性增加到原对象的对象} addObject
 */
export function addObjectAttr(originalObject, addObject) {
  if (!originalObject) {
    originalObject = {};
  }
  for (let key of Object.keys(addObject)) {
    if (Object.prototype.toString.call(addObject[key]) === '[object Object]') {
      originalObject[key] = addObjectAttr(originalObject[key], addObject[key]);
    } else {
      originalObject[key] = addObject[key];
    }
  }
  return originalObject;
}

//公共访问的路由
export const publicAccessRoutes = [
  {
    url: '/test',
    type: '',
  },
  {
    url: '/go',
    type: 'noLayout',
  },
  {
    url: '/shuishi',
    type: '',
  },
];
