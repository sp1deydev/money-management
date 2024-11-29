import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Row, Col, Popconfirm, Select, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { userApi } from '../api/userApi';
import { capitalizeFirstLetter } from '../helpers/toUpperCase';
import { authApi } from '../api/authApi';

const { Option } = Select;

const roleColors = {
  admin: 'volcano',
  user: 'blue',
  system: 'green',
};

const Users = () => {
  const [data, setData] = useState([]);

  const getAllUsers = async function() {
    try {
        const response = await userApi.getAllUsers();
        setData(response.data.data);
      }  catch (err) {
      }
  }
  useEffect(() => {
    getAllUsers()
  }, [])

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
    form.resetFields();
    addForm.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        await userApi.updateRole({ role: values.role, id: editingRecord._id });
        getAllUsers();
        message.success('Cập nhật vai trò thành công!');
      } catch (err) {
        message.error('Cập nhật vai trò thất bại!');
      }
      handleCancel();
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleAdd = () => {
    addForm.validateFields().then(async (values) => {
      const newUser = {
        ...values,
        password: '123456'
      };
      try {
        const res = await authApi.register(newUser);
        if(!res.data.success) {
            message.error(res.data.message);
        }
        else {
            message.success('Thêm người dùng thành công!');
            setData([...data, res.data.data]);
            handleCancel();
        }
      }  catch (err) {
        message.error('Thêm người dùng lỗi');
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDelete = async (id) => {
    try {
        const res = await userApi.deleteUserByAdmin({id});
        message.success('Xóa bản ghi thành công!');
        getAllUsers()
      }  catch (err) {
      }
   
  };

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Tên', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Họ', dataIndex: 'lastname', key: 'lastname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={roleColors[role]}>{capitalizeFirstLetter(role)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            shape="circle"
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bản ghi này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              shape="circle"
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" style={{ margin: '24px 0px' }}>
        <Col>
          <Input.Search
            placeholder="Tìm kiếm theo bất kỳ trường nào"
            enterButton
            onChange={(e) => console.log(e.target.value)} // Simple search handler
            style={{ width: 360 }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Thêm người dùng mới
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} />

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa vai trò"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="edit_form">
          <Form.Item name="username" label="Tên đăng nhập">
            <Input disabled />
          </Form.Item>
          <Form.Item name="firstname" label="Họ">
            <Input disabled />
          </Form.Item>
          <Form.Item name="lastname" label="Tên">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Thêm người dùng mới"
        visible={isAddModalVisible}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical" name="add_form">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="firstname"
            label="Họ"
            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
