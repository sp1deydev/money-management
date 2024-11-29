import React, { useState } from 'react';
import {
  Layout,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Progress,
  Row,
  Col,
  Popconfirm,
  message,
  Modal,
  Typography,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Header, Content } = Layout;

const Goal = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const calculateProgress = (currentAmount, targetAmount) => {
    return Math.min((currentAmount / targetAmount) * 100, 100).toFixed(2);
  };

  const handleAddGoal = (values) => {
    const newGoal = {
      key: goals.length + 1,
      name: values.name,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      deadline: values.deadline.format('YYYY-MM-DD'),
    };
    newGoal.progress = calculateProgress(newGoal.currentAmount, newGoal.targetAmount);

    setGoals([...goals, newGoal]);
    message.success('Mục tiêu đã được thêm!');
    form.resetFields();
  };

  const handleDeleteGoal = (key) => {
    setGoals(goals.filter((goal) => goal.key !== key));
    message.success('Mục tiêu đã được xóa!');
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    editForm.setFieldsValue({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: moment(goal.deadline, 'YYYY-MM-DD'),
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateGoal = (values) => {
    const updatedGoal = {
      ...editingGoal,
      name: values.name,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      deadline: values.deadline.format('YYYY-MM-DD'),
    };
    updatedGoal.progress = calculateProgress(updatedGoal.currentAmount, updatedGoal.targetAmount);

    setGoals(
      goals.map((goal) => (goal.key === updatedGoal.key ? updatedGoal : goal))
    );
    setIsEditModalVisible(false);
    message.success('Mục tiêu đã được cập nhật!');
  };

  const columns = [
    {
      title: 'Tên Mục Tiêu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số Tiền Cần Đạt (VNĐ)',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: 'Số Tiền Hiện Có (VNĐ)',
      dataIndex: 'currentAmount',
      key: 'currentAmount',
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: 'Thời Hạn',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Tiến Độ',
      key: 'progress',
      render: (_, record) => (
        <Progress percent={parseFloat(record.progress)} />
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditGoal(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa mục tiêu này?"
            onConfirm={() => handleDeleteGoal(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#E8F5E9' }}>
      <Title level={4} style={{ color: '#444' }}>
        Mục tiêu tài chính
      </Title>
      <Content>
        <Row gutter={16}>
          <Col span={8}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddGoal}
              style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}
            >
              <Form.Item
                label="Tên Mục Tiêu"
                name="name"
                rules={[{ required: true, message: 'Hãy nhập tên mục tiêu!' }]}
              >
                <Input placeholder="Nhập tên mục tiêu" />
              </Form.Item>
              <Form.Item
                label="Số Tiền Cần Đạt"
                name="targetAmount"
                rules={[{ required: true, message: 'Hãy nhập số tiền cần đạt!' }]}
              >
                <InputNumber
                  placeholder="Nhập số tiền"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  addonAfter="VND"
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item
                label="Số Tiền Hiện Có"
                name="currentAmount"
                rules={[{ required: true, message: 'Hãy nhập số tiền hiện có!' }]}
              >
                <InputNumber
                  placeholder="Nhập số tiền"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  addonAfter="VND"
                  parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item
                label="Thời Hạn"
                name="deadline"
                rules={[{ required: true, message: 'Hãy chọn thời hạn!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Thêm Mục Tiêu
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={16}>
            <Table
              dataSource={goals}
              columns={columns}
              bordered
            />
          </Col>
        </Row>

        <Modal
          title="Chỉnh Sửa Mục Tiêu"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateGoal}
          >
            <Form.Item
              label="Tên Mục Tiêu"
              name="name"
              rules={[{ required: true, message: 'Hãy nhập tên mục tiêu!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số Tiền Cần Đạt"
              name="targetAmount"
              rules={[{ required: true, message: 'Hãy nhập số tiền cần đạt!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} addonAfter='VND'/>
            </Form.Item>
            <Form.Item
              label="Số Tiền Hiện Có"
              name="currentAmount"
              rules={[{ required: true, message: 'Hãy nhập số tiền hiện có!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} addonAfter='VND'/>
            </Form.Item>
            <Form.Item
              label="Thời Hạn"
              name="deadline"
              rules={[{ required: true, message: 'Hãy chọn thời hạn!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < moment().endOf('day')}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Cập Nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Goal;