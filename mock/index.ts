type CourseList = {
  id: string;
  type: string;
  name: string;
  totalPrice: string;
  amount: string;
  address: string;
};

let courseList: CourseList[] = [
  {
    id: '1',
    type: 'React',
    name: 'dvaJS实战点餐系统(商品管理/购物车/数据请求/路由)',
    totalPrice: '¥38',
    amount: '999',
    address: 'https://ke.qq.com/course/382788?tuin=c9304a42',
  },
  {
    id: '2',
    type: 'React',
    name: 'UmiJS2商业级实战项目OA管理系统',
    totalPrice: '¥58',
    amount: '999',
    address: 'https://ke.qq.com/course/470529?tuin=c9304a42',
  },
  {
    id: '3',
    type: 'React',
    name: 'ReactHooks核心API精讲(useState/Effect/Context/优化/重构)',
    totalPrice: '¥38',
    amount: '999',
    address: 'https://ke.qq.com/course/464538?tuin=c9304a42',
  },
  {
    id: '4',
    type: 'React',
    name: 'React全栈商业级应用项目',
    totalPrice: '¥68',
    amount: '999',
    address: 'https://ke.qq.com/course/464697?tuin=c9304a42',
  },
  {
    id: '5',
    type: 'React',
    name: 'UmiJS3+Typescript+Mock用户管理系统',
    totalPrice: '¥38',
    amount: '999',
    address: 'https://ke.qq.com/course/464697?tuin=c9304a42',
  },
];

// 获取路径参数
function getUrlParam(url: string, key: string) {
  // 获取参数
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)'); // 匹配目标参数
  var result = url.split('?')[1].match(reg); // 返回参数值
  var keywords = result ? decodeURIComponent(result[2]) : '';
  return keywords;
}

const getCourseList = (req: { url: string }, res: any) => {
  // console.log(req.url);
  let keywords = getUrlParam(req.url, 'keywords');
  let filterList =
    !keywords || keywords == ''
      ? courseList
      : courseList.filter((item: { type: string; name: string }) => {
          return (
            item.type.indexOf(keywords) !== -1 ||
            item.name.indexOf(keywords) !== -1
          );
        });
  res.send({
    success: true,
    datas: filterList,
    keywords: keywords,
  });
};

// 添加课程
const addCourse = (req: { body: CourseList }, res: any) => {
  let { type, name, totalPrice, amount, address } = req.body;
  courseList.unshift({
    id: Date.now().toString(),
    type,
    name,
    totalPrice,
    amount,
    address,
  });

  res.send({ msg: '添加成功', success: true });
};

// 获取编辑课程信息
const getEditCourse = (req: { url: string }, res: any) => {
  let id = getUrlParam(req.url, 'id');
  let index = courseList.findIndex((item: CourseList) => item.id == id);
  if (index == -1) {
    res.send({ msg: '该课程不存在', success: false });
  }

  res.send({ success: true, datas: courseList[index] });
};

// submit edit
const editCourse = (req: { body: CourseList }, res: any) => {
  let { id } = req.body;
  let index = courseList.findIndex((item: CourseList) => item.id == id);

  if (index == -1) {
    res.send({ msg: '该课程不存在', success: false });
  }

  courseList[index] = { ...req.body };

  res.send({ msg: '编辑成功', success: true });
};

// 删除课程信息
const deleteCourse = (req: { url: string }, res: any) => {
  let id = getUrlParam(req.url, 'id');
  let index = courseList.findIndex((item: CourseList) => item.id == id);
  if (index == -1) {
    res.send({ msg: '该课程不存在', success: false });
  }

  // 更新数据
  courseList.splice(index, 1);

  res.send({ success: true, msg: '删除成功' });
};

export default {
  '/api/courseList': getCourseList,
  '/api/dictionary/type': {
    datas: [
      { label: 'React', value: 'React' },
      { label: 'Vue', value: 'Vue' },
      { label: 'Node', value: 'Node' },
      { label: 'uniapp', value: 'uniapp' },
    ],
  },
  'POST /api/course/add': addCourse,
  '/api/course/editCourse': getEditCourse,
  'POST /api/course/edit': editCourse,
  "DELETE /api/course/delete": deleteCourse
};
