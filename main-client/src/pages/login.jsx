import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Space, Checkbox, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { userSlice } from '../redux/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { handleLocalStorage } from '../utils/handleLocalStorage';
import handleAuthToken from '../utils/handleAuthToken';
import { handleSessionStorage } from '../utils/handleSessionStorage';
import Loading from '../components/loading';
import logo from '../assets/emoney.png'
import OTP from '../components/OTP/otp';

Login.propTypes = {
    
};

const { Text, Link } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
  
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


function Login(props) {
    const navigate = useNavigate();
    const currentUser = useSelector((state)=> state.user.currentUser) || {};
    const isLoading = useSelector((state)=> state.user.isLoading)
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!Object.keys(currentUser).length === 0 && searchParams.get('redirect')) {
      navigate(searchParams.get('redirect'));
    }

    if (!Object.keys(currentUser).length === 0 && !searchParams.get('redirect')) {
      navigate('/');
    }
  }, [currentUser, searchParams, navigate]);

      const onFinish = (values) => {
        form.validateFields().then(async (values) => {
          dispatch(userSlice.actions.setIsLoading(true))
          try {
            const res = await authApi.login(values);
            if (!res.data.success) {
              toast.error(res.data.message);
              form.resetFields();
              dispatch(userSlice.actions.setIsLoading(false))
              return;
            }
            
            const { user } = res.data;
            const currentUser = {
              id: user._id,
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
            };
            dispatch(userSlice.actions.setCurrentUser(currentUser));
            handleAuthToken(res.data.token);
            if(values.remember) {
              handleLocalStorage.set('access_token', res.data.token);
            }
            handleSessionStorage.set('access_token', res.data.token);
            toast.success('Đăng nhập thành công');
            dispatch(userSlice.actions.setIsLoading(false))
            
            if (searchParams.get('redirect')) {
              navigate(searchParams.get('redirect'));
            } else {
              navigate('/');
            }
          } catch (error) {
            const errorMessage =
            error.response.data?.message ||
            'Có lỗi xảy ra phía máy chủ, vui lòng thử lại!';
            toast.error(errorMessage);
            dispatch(userSlice.actions.setIsLoading(false))
          }
            //
            if (searchParams.get('redirect')) {
              navigate(searchParams.get('redirect'));
            } else {
              navigate('/');
            }
      }).catch((err) => {
            // form validation failed
            console.log(err)
        })
      };

      const handleRegiterClick = () => {
        navigate('/register')
      }
    

    return (
      <div className="form-container">
        <div className="sub-form-container">
        <div
          className="logo"
          style={{ width: "100%",textAlign: 'center', margin:'-20px 0px 0px 8px' }}
        >
          <img
            src={logo} // Replace with your logo image path
            alt="Logo"
            style={{
              width: "200px",
              margin:'8px'
            }}
          />
        </div>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              style={{
                marginLeft: "33%",
                width: "700px",
                marginBottom: "-8px",
              }}
            >
              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Checkbox>Nhớ tài khoản</Checkbox>
              </Form.Item>
              <Link
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  lineHeight: "32px",
                  margin: "0px 0px 0px 8px",
                }}
                onClick={() => dispatch(userSlice.actions.setForgotFactor('password'))}
              >
                Quên mật khẩu?
              </Link>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {isLoading && <Loading color="#fff" bgColor="#1677ff" />}
                  Đăng nhập
                </Button>
                <Text type="secondary">Chưa có tài khoản?</Text>
              </Space>
              <Button
                type="link"
                htmlType="button"
                onClick={() => handleRegiterClick()}
              >
                <Text underline italic>
                  Đăng ký
                </Text>
              </Button>
            </Form.Item>
          </Form>
        </div>
        <OTP/>
      </div>
    );
}

export default Login;