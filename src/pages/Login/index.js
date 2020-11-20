import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { connect, Redirect, history } from 'umi';
import { SUCCESS_CODE } from "../../utils/const"
import './index.scss';


const Login = props => {
  const onFinish = values => {
    console.log('Success:', values);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("password", values.password);
    formData.append("appKey", BUILDING_KEY);
    props.login(formData).then(res => {
      if(res.code === SUCCESS_CODE){
        window.sessionStorage.setItem("accessToken", res.data.access_token);
        history.push('/');
      }else {
        message.error('登录失败')
      }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const [form] = Form.useForm();

  useEffect(() => {
    // sessionStorage.clear();
    onFinish({
      name: USERNAME,
      password: PASSWORD
    })
  }, []);

  return (
    <div className="login-page-wrap" style={{display:"none"}}>
      <Form
        layout={'vertical'}
        form={form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="name"
          initialValue={USERNAME}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          initialValue={PASSWORD}
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            danger
            block
            loading={props.loading.effects['login/login']}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ loading }) => ({
  loading
});

const mapDispatchToProps = dispatch => ({
  login(data) {
    return dispatch({
      type: 'login/login',
      data,
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
