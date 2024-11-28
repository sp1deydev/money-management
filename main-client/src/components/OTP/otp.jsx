import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Typography } from 'antd';
import { otpApi } from '../../api/otpApi';
import { toast } from 'react-toastify';
import Loading from '../loading';
import { userSlice } from '../../redux/userSlice';
import { userApi } from '../../api/userApi';
import ForgotPassword from '../ForgotPassword/forgotPassword';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

const OTP = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotFactor = useSelector((state)=> state.user.forgotFactor);
  const currentUser = useSelector((state)=> state.user.currentUser);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSetEmail, setIsSetEmail] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [otpEmail, setotpEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSetUsername, setIsSetUsername] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30); // 30-second timer
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    if(!forgotFactor) {
      setVisible(false)
      setIsLoading(false);
      setIsSetEmail(false);
      setotpEmail('')
      setIsCounting(false);
      setIsOTPVerified(false);
      setIsSetUsername(false)
      setUsername('');
    }
    else {
      // if(forgotFactor == '2fa') {
      //   setUsername(currentUser.username);
      // }
      setVisible(true)
    }
  }, [forgotFactor]);

  // Start countdown on component mount or when 'isCounting' changes
  useEffect(() => {
    if (isCounting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timer);
          return 0;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isCounting, countdown]);

  // Restart countdown (e.g., when a new OTP is sent)
  const resetCountdown = async () => {
    try {
        setIsLoading(true);
        const response = await otpApi.generateOTP({email: otpEmail});
        if(!response.data.success) {
            setIsLoading(false);
            toast.error(response.data.message);
            return;
        }
        else {
            toast.success(response.data.message);
            setIsSetEmail(true);
            const expires = Number(response.data.expires/1000);
            setCountdown(expires);
            setIsCounting(true);
            setIsLoading(false);
        }
    }
    catch (err) {
        toast.error('Get error when try to send email!');
        setIsLoading(false);
    }
  };
  const resetEmail = () => {
    setIsSetEmail(false);
    setotpEmail('')
    setIsCounting(false);
    setIsOTPVerified(false)
  };

  // Function to handle form submission
  const onSendmail = async (values) => {
    console.log('Received values:', values);
    let payload = {...values}
    payload.username = username;
    try {
        setIsLoading(true);
        setotpEmail(values.email)
        const response = await otpApi.generateOTP(payload);
        if(!response.data.success) {
            setIsLoading(false);
            toast.error(response.data.message);
            return;
        }
        else {
            toast.success(response.data.message);
            setIsSetEmail(true);
            const expires = Number(response.data.expires/1000);
            setCountdown(expires);
            setIsCounting(true);
            setIsLoading(false);
        }
    }
    catch (err) {
        toast.error('Get error when try to send email!');
        setIsLoading(false);
    }
  };

  const onConfirmUsername = async (values) => {
    console.log('Received values:', values);
    try {
        setIsLoading(true);
        const response = await userApi.checkUsername(values);
        if(!response.data.success) {
            setIsLoading(false);
            toast.error(response.data.message);
            return;
        }
        else {
            toast.success(response.data.message);
            setUsername(response.data.result);
            setIsSetUsername(true)
            setIsLoading(false);
        }
    }
    catch (err) {
      const errorMessage =
            err.response.data?.message ||
            'Internal Server Error';
        toast.error(errorMessage);
        setIsLoading(false);
    }
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setVisible(false);
    setIsLoading(false);
    setIsSetEmail(false);
    setotpEmail('')
    setIsCounting(false);
    setIsOTPVerified(false);
    setIsSetUsername(false)
    setUsername('');
    dispatch(userSlice.actions.setForgotFactor(''))
  };

  const onChange = (text) => {
    const onlyNumbers = text.target.value.replace(/\D/g, '');
    setOtp(onlyNumbers);
  };

  const handleOTP = async (e) => {
    // e.preventDefault();
    console.log('Submitted OTP:', otp);
    try {
        setIsLoading(true);
        const response = await otpApi.verifyOTP({email: otpEmail, otp: otp});
        if(!response.data.success) {
            toast.error(response.data.message);
            setIsLoading(false);
            return;
        }
        else {
            toast.success(response.data.message);
            setCountdown(0);
            setIsCounting(false);
            setIsLoading(false);
            setIsOTPVerified(true)
            if(forgotFactor == '2fa') {
              setVisible(false);
              let newCurrentUser = {...currentUser}
              newCurrentUser.isMFA = true;
              dispatch(userSlice.actions.setCurrentUser(newCurrentUser))
              dispatch(userSlice.actions.setForgotFactor(''));
              // if (window.location.pathname.includes('admin')) {
              //   navigate(`/admin/mfa-configuration`);
              // } else if (window.location.pathname.includes('system')) {
                //   navigate(`/system/mfa-configuration`);
                // } else {
                  //   navigate(`/mfa-configuration`);
                  // }
                navigate(`/forgot/mfa-configuration`);
            }
        }
    }
    catch (err) {
        const errorMessage = err.response.data?.message || 'Get error when try to send email!'
        toast.error(errorMessage);
        setIsLoading(false);
    }
    // Perform OTP verification here
  };

  const emailElement = (
        <Form
          name="email-form"
          onFinish={onSendmail}
          layout="vertical"
          initialValues={{ username: '' }}
          style={{marginTop:'-30px'}}
        >
            <Typography.Title level={5}>Input Your Email</Typography.Title>
          <Form.Item
            // label="Username"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Enter your email"/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={isLoading}>
             {isLoading && <Loading color="#fff" bgColor="#1677ff" size="50"/>}
              Send OTP
            </Button>
          </Form.Item>
        </Form>
  )
  const otpElement = (
    <Flex gap="middle" align="flex-start" vertical>
      <Flex gap="middle" align="flex-start">
        <Typography.Title level={5} style={{marginTop:'-1px'}}>OTP Verification</Typography.Title>
        <Typography.Text type={countdown === 0 ? "danger" : "secondary"}>
          {countdown > 0 ? `Expires in ${countdown}s` : "OTP expired"}
        </Typography.Text>
      </Flex>

      <Form onFinish={handleOTP}>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "OTP is required" },
            { min: 6, message: "OTP must be at least 6 characters" }, // Minimum length rule
            { pattern: /^\d+$/, message: "OTP must be a number" }, // Only numbers allowed
          ]}
        >
          <Input
            maxLength={6}
            value={otp}
            placeholder="Enter OTP"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          <Flex gap="middle" align="flex-start">
            <Button type="primary" htmlType="submit" disabled={countdown === 0 || isLoading}>
              Submit OTP
            </Button>
            <Button
              type="link"
              onClick={resetCountdown}
              disabled={countdown > 0 || isLoading}
            >
              Resend OTP
            </Button>
            <Button type="link" onClick={resetEmail} disabled={isLoading}>
              Another email?
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );

  const usernameElement = (
    <Form
    name="username-form"
    onFinish={onConfirmUsername}
    layout="vertical"
    initialValues={{ username: '' }}
    style={{marginTop:'-30px'}}
    >
      <Typography.Title level={5}>Input Your Username</Typography.Title>
    <Form.Item
      // label="Username"
      name="username"
      rules={[
        { required: true, message: 'Please input your username!' },
      ]}
    >
      <Input placeholder="Enter your username"/>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={isLoading}>
       {isLoading && <Loading color="#fff" bgColor="#1677ff" size="50"/>}
        Confirm
      </Button>
    </Form.Item>
  </Form>
  )


  
  // const forgotPassword = ()
  // const forgot2FA = ()


  return (
    <div>
      {/* Modal containing the form */}
      <Modal
        // title="Input your email"
        visible={visible}
        maskClosable={false}
        onCancel={handleCancel}
        footer={null} // To avoid the default footer and customize the button
        width={400}
        bodyStyle={isLoading ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }: ""}
      >
        {!isSetUsername && forgotFactor == 'password' ? 
          (isLoading ? 
            <Loading color="#fff" bgColor="#1677ff" size='64'/> : 
            usernameElement
          ) 
        :
        (!isOTPVerified ? 
          (isLoading ? 
            <Loading color="#fff" bgColor="#1677ff" size='64'/> : 
            (isSetEmail ? otpElement : emailElement)
          ) : 
          (isLoading ? 
          <Loading color="#fff" bgColor="#1677ff" size='64'/> : 
          (forgotFactor == 'password' ? <ForgotPassword username={username}/> : '')
          )
        )
        }
      </Modal>
    </div>
  );
};

export default OTP;
