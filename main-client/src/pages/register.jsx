import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { userSlice } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';
import Loading from '../components/loading';

Register.propTypes = {
    
};

const { Text } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

function Register(props) {
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.user.isLoading)
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    
      const onFinish = (values) => {
        form.validateFields().then(async (values) => {
          dispatch(userSlice.actions.setIsLoading(true))
          console.log(values);
          let newUser = {...values}
          newUser.role = "user";
          try {
            const res = await authApi.register(newUser)
            if (!res.data.success) {
              toast.error(res.data.message);
              //reset form
              return;
            }
            toast.success('Đăng ký thành công');
            dispatch(userSlice.actions.setIsLoading(false))
            navigate('/login');
          }
          catch (err) {
            const errorMessage =
            err.response.data?.message ||
            "Có lỗi xảy ra phía máy chủ, vui lòng thử lại!";
            toast.error(errorMessage);
          }
        }).catch((err) => {
          // form validation failed
          console.log(err)
          dispatch(userSlice.actions.setIsLoading(false))
        })
      };
      
      const handleSignInClick = () => {
        navigate('/login')
      }
    

    return (
      <div className="form-container">
        <div className="sub-form-container">
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >

            <Form.Item label="Họ và tên" style={{ marginBottom: 0 }} required>
              <Form.Item
                name="firstname"
                rules={[{ required: true }]}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Input placeholder="Tên" />
              </Form.Item>
              <Form.Item
                name="lastname"
                rules={[{ required: true }]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0px 0px 0px 12px",
                }}
              >
                <Input placeholder="Họ" />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Input valid Email",
                },
              ]}
            >
              <Input placeholder="Email"/>
            </Form.Item>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tên đăng nhập"/>
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                 {isLoading && <Loading color="#fff" bgColor="#1677ff" />}
                  Đăng ký
                </Button>
                <Text type="secondary">Đã có tài khoản?</Text>
              </Space>
              <Button
                type="link"
                htmlType="button"
                onClick={() => handleSignInClick()}
              >
                <Text underline italic>
                  Đăng nhập
                </Text>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
}

export default Register;