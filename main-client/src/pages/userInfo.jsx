import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Typography, List, Card, Input, message, Button, Flex, Popconfirm, Modal, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { userSlice } from '../redux/userSlice';
import { validateEmail } from '../helpers/emailRegEx';
import { toast } from 'react-toastify';
import { userApi } from '../api/userApi';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../helpers/toUpperCase';

UserInfo.propTypes = {
    
};

function UserInfo(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changePasswordForm] = Form.useForm(); // change password form
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const currentUser = useSelector((state) => state.user.currentUser) || {};
  const [editElement, setEditElement] = useState();
  const [editValue, setEditValue] = useState();

  //delete account
  const onConfirmDeleteAccount = async () => {
    dispatch(userSlice.actions.setIsLoading(true));
    try {
      const res = await userApi.deleteUser();
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      dispatch(userSlice.actions.removeCurrentUser());
      dispatch(userSlice.actions.setIsLoading(false));
      navigate('/home')
      toast.success(res.data.message);
      
    } 
    catch (err) {
      toast.error(err);
      dispatch(userSlice.actions.setIsLoading(false));
    }
  }

  //change password modal
  const showModal = () => {
    setIsModalChangePasswordOpen(true);
  };
  const handleCancelChangePassword = () => {
    changePasswordForm.resetFields()
    setIsModalChangePasswordOpen(false);
  };
  //submit change password form
  const onChangePasswordFromFinish = async (values) => {
    if (values.newPassword === values.password) {
      toast.error('The new password cannot be the same as the old password')
      changePasswordForm.resetFields()
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Confirm password do not match')
      changePasswordForm.resetFields()
      return;
    }
    dispatch(userSlice.actions.setIsLoading(true));
    try {
      const res = await userApi.changePassword({password: values.password, newPassword: values.newPassword});
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setIsModalChangePasswordOpen(false);
      dispatch(userSlice.actions.setIsLoading(false));
      changePasswordForm.resetFields()
      toast.success(res.data.message)
    }
    catch (err) {
      const errorMessage =
      err.response.data?.message ||
      "Có lỗi xảy ra phía máy chủ, vui lòng thử lại!";
      toast.error(errorMessage);
      dispatch(userSlice.actions.setIsLoading(false));
      changePasswordForm.resetFields()
    }
  }



  //change user infor
  const handEditFormChange = (e) => {
    setEditValue(e.target.value)  
  }
  const handleCancelEdit = () => {
    setEditValue()
    setEditElement();
  }
  const handleUpdate = async () => {
    if(!editValue) {
      messageApi.open({
        type: 'error',
        content: 'Please enter value!',
        duration: 2,
      });
      return;
    }
    //validate email address
    if(editElement === "email" && !validateEmail(editValue)) {
      messageApi.open({
        type: 'error',
        content: 'Please enter valid email!',
        duration: 2,
      });
      return;
    }
    //api
    const updateUser = {...currentUser}
    updateUser[editElement] = editValue;
    try {
      const res = await userApi.updateUser(updateUser);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      const { user } = res.data;
      const currentUser = {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        createdAt: user.createdAt,
      };
      toast.success(res.data.message)
      dispatch(userSlice.actions.editUser(currentUser));
      setEditValue()
      setEditElement();
    }
    catch (err) {
      toast.error(err);
    }
  }

  const handleEditFirstname = () => {
    setEditValue(currentUser.firstname)
    setEditElement("firstname");
  }
  const handleEditLastName = () => {
    setEditValue(currentUser.lastname)
    setEditElement("lastname");
  }
  const handleEditEmail = () => { 
    setEditValue(currentUser.email)
    setEditElement("email");
  }

  return (
    <div className="form-container">
      <div className="sub-info-container">
        {contextHolder} {/* message validate form */}
        <Card>
          <Card.Meta
            avatar={
              <Avatar src="https://www.366icons.com/media/01/profile-avatar-account-icon-16699.png" />
            }
            title={currentUser.username || "test-username"}
            description={`Role: ${capitalizeFirstLetter(currentUser.role)}`}
          />
          <List>
            <List.Item
              actions={
                editElement === "firstname"
                  ? [
                      <a key="list-loadmore-edit" onClick={handleCancelEdit}>
                        Cancel
                      </a>,
                      <a key="list-loadmore-edit" onClick={handleUpdate}>
                        Update
                      </a>,
                    ]
                  : [
                      <a key="list-loadmore-edit" onClick={handleEditFirstname}>
                        Edit
                      </a>,
                    ]
              }
            >
              {editElement === "firstname" ? (
                <Input
                  placeholder="Enter value"
                  name="title"
                  value={editValue}
                  onChange={(event) => handEditFormChange(event)}
                  variant="borderless"
                  autoFocus
                />
              ) : (
                <Typography.Text>
                  <i>First Name:</i> {currentUser.firstname}
                </Typography.Text>
              )}
            </List.Item>

            <List.Item
              actions={
                editElement === "lastname"
                  ? [
                      <a key="list-loadmore-edit" onClick={handleCancelEdit}>
                        Cancel
                      </a>,
                      <a key="list-loadmore-edit" onClick={handleUpdate}>
                        Update
                      </a>,
                    ]
                  : [
                      <a key="list-loadmore-edit" onClick={handleEditLastName}>
                        Edit
                      </a>,
                    ]
              }
            >
              {editElement === "lastname" ? (
                <Input
                  placeholder="Enter value"
                  name="title"
                  value={editValue}
                  onChange={(event) => handEditFormChange(event)}
                  variant="borderless"
                  autoFocus
                />
              ) : (
                <Typography.Text>
                  <i>Last Name:</i> {currentUser.lastname}
                </Typography.Text>
              )}
            </List.Item>

            <List.Item
              actions={
                editElement === "email"
                  ? [
                      <a key="list-loadmore-edit" onClick={handleCancelEdit}>
                        Cancel
                      </a>,
                      <a key="list-loadmore-edit" onClick={handleUpdate}>
                        Update
                      </a>,
                    ]
                  : [
                      <a key="list-loadmore-edit" onClick={handleEditEmail}>
                        Edit
                      </a>,
                    ]
              }
            >
              {editElement === "email" ? (
                <Input
                  placeholder="Enter value"
                  name="title"
                  value={editValue}
                  onChange={(event) => handEditFormChange(event)}
                  variant="borderless"
                  autoFocus
                />
              ) : (
                <Typography.Text>
                  <i>Email:</i> {currentUser.email}
                </Typography.Text>
              )}
            </List.Item>
          </List>
          <Flex gap="small" justify="center" style={{ marginTop: "16px" }}>
            <Button type="primary" icon={<EditOutlined />} onClick={showModal}>
              Change Password
            </Button>
            <Modal
              centered
              title="Change Password"
              open={isModalChangePasswordOpen}
              onOk={()=>changePasswordForm.submit()}
              onCancel={handleCancelChangePassword}
              okText="Change"
            >
              <Form
                form={changePasswordForm}
                labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onChangePasswordFromFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Current Password"
                  name="password"
                  rules={[
                    { required: true, min: 6, message: "Please input valid current password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="New password"
                  name="newPassword"
                  rules={[
                    { required: true, min: 6, message: "Please input valid current password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    { required: true, min: 6, message: "Please input valid current password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Form>
            </Modal>
            {/* delete account */}
            <Popconfirm
              title="Delete account"
              description="Are you sure to delete this account?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              okButtonProps={{ danger: true }}
              onConfirm={onConfirmDeleteAccount}
              // onCancel={onCancelDeleteAccount}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="primary" icon={<DeleteOutlined />} danger>
                Delete Account
              </Button>
            </Popconfirm>
          </Flex>
        </Card>
      </div>
    </div>
  );
}

export default UserInfo;