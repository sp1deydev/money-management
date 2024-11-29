import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Typography } from 'antd';
import { otpApi } from '../../api/otpApi';
import { toast } from 'react-toastify';
import Loading from '../loading';
import { userSlice } from '../../redux/userSlice';
import { userApi } from '../../api/userApi';
const { Title } = Typography;

const ForgotPassword = (props) => {
    const dispatch = useDispatch()
    const [forgotPasswordForm] = Form.useForm();
    // forgotPasswordForm.resetFields()

    const onForgotPassword = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
          toast.error('Confirm password do not match')
          forgotPasswordForm.resetFields()
          return;
        }
        try {
          const res = await userApi.forgotPassword({username: props.username, newPassword: values.newPassword});
          if (!res.data.success) {
            toast.error(res.data.message);
            return;
          }
          dispatch(userSlice.actions.setIsLoading(false));
          dispatch(userSlice.actions.setForgotFactor(''));
          forgotPasswordForm.resetFields()
          toast.success(res.data.message)
        }
        catch (err) {
          const errorMessage =
          err.response.data?.message ||
          "Có lỗi xảy ra phía máy chủ, vui lòng thử lại!";
          toast.error(errorMessage);
          dispatch(userSlice.actions.setIsLoading(false));
          forgotPasswordForm.resetFields()
        }
      }


  return (
    <Form
          form={forgotPasswordForm}
          layout="vertical"
          onFinish={onForgotPassword}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{marginTop:'-30px'}}
        >
            <Typography.Title level={5}>Đặt lại mật khẩu</Typography.Title>
          <Form.Item
            // label="New password"
            name="newPassword"
            rules={[
              { required: true, min: 6, message: "Please input valid new password!" },
            ]}
          >
            <Input.Password placeholder='Nhập mật khẩu mới'/>
          </Form.Item>
          <Form.Item
            // label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, min: 6, message: "Please input valid confirm password!" },
            ]}
          >
            <Input.Password placeholder='Xác nhận mật khẩu'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} >
             {/* {isLoading && <Loading color="#fff" bgColor="#1677ff" size="50"/>} */}
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
  );
};

export default ForgotPassword;
