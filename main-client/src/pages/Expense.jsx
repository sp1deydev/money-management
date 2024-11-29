import React, { useState } from 'react';
import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Modal,
    Form,
    DatePicker,
    Select,
    Table,
    Input,
} from 'antd';
import {
    HomeTwoTone,
    SmileTwoTone,
    HeartTwoTone,
    SafetyCertificateTwoTone,
    AppstoreTwoTone,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

function Expenses() {
    const [expenseRecords, setExpenseRecords] = useState([
        { id: 1, type: 'Chi phí sinh hoạt', value: 2000000, date: '2024-11-01', note: 'Mua sắm nhu yếu phẩm' },
        { id: 2, type: 'Chi phí giải trí & sở thích', value: 1500000, date: '2024-11-05', note: 'Xem phim' },
        { id: 3, type: 'Chi phí chăm sóc sức khỏe', value: 1000000, date: '2024-11-10', note: 'Khám sức khỏe' },
        { id: 4, type: 'Tiết kiệm & đầu tư', value: 2000000, date: '2024-11-12', note: 'Gửi tiết kiệm ngân hàng' },
        { id: 5, type: 'Khác', value: 500000, date: '2024-11-15', note: 'Mua quà tặng' },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [form] = Form.useForm();

    const expenseCategories = [
        { name: 'Chi phí sinh hoạt', color: '#FF6F61', icon: <HomeTwoTone twoToneColor="#FF6F61" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí giải trí & sở thích', color: '#6A9FB5', icon: <SmileTwoTone twoToneColor="#6A9FB5" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí chăm sóc sức khỏe', color: '#4F75FF', icon: <HeartTwoTone twoToneColor="#4F75FF" style={{ fontSize: 48 }} /> },
        { name: 'Tiết kiệm & đầu tư', color: '#4CAF50', icon: <SafetyCertificateTwoTone twoToneColor="#4CAF50" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí gia đình', color: '#6A1B9A', icon: <HomeTwoTone twoToneColor="#6A1B9A" style={{ fontSize: 48 }} /> },
        { name: 'Khác', color: '#E0A75E', icon: <AppstoreTwoTone twoToneColor="#E0A75E" style={{ fontSize: 48 }} /> },
    ];

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const parseCurrency = (value) => parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    const formatInputCurrency = (value) => {
        if (!value) return '';
        if (typeof value !== 'number') {
            value = parseInt(value.replace(/[^0-9]/g, ''), 10);
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const handleAddExpense = (values) => {
        const newExpense = {
            id: expenseRecords.length + 1,
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
            note: values.note,
        };
        setExpenseRecords([...expenseRecords, newExpense]);
        setIsModalVisible(false);
    };

    const handleEditExpense = (values) => {
        const updatedExpense = {
            ...currentExpense,
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
            note: values.note,
        };
        setExpenseRecords(
            expenseRecords.map((expense) =>
                expense.id === currentExpense.id ? updatedExpense : expense
            )
        );
        setIsModalVisible(false);
        setIsEditMode(false);
        form.resetFields();
    };

    const handleDeleteExpense = (id) => {
        setExpenseRecords(expenseRecords.filter((expense) => expense.id !== id));
    };

    const renderExpenseModal = () => (
        <Modal
            title={isEditMode ? 'Chỉnh sửa chi tiêu' : 'Thêm khoản chi tiêu'}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            maskClosable={false}
        >
            <Form
                form={form}
                initialValues={{
                    type: currentExpense ? currentExpense.type : '',
                    value: currentExpense ? formatCurrency(currentExpense.value) : '',
                    date: currentExpense ? moment(currentExpense.date) : moment(),
                    note: currentExpense ? currentExpense.note : '',
                }}
                onFinish={isEditMode ? handleEditExpense : handleAddExpense}
            >
                <Form.Item
                    name="type"
                    label="Loại chi tiêu"
                    rules={[{ required: true, message: 'Vui lòng chọn loại chi tiêu!' }]}
                >
                    <Select>
                        {expenseCategories.map((category) => (
                            <Select.Option key={category.name} value={category.name}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Số tiền"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                >
                    <Input type="text" addonAfter="VND"
                     onChange={(e) =>
                        form.setFieldsValue({ value: formatInputCurrency(e.target.value) })
                    }
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Ngày chi tiêu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item style={{ textAlign: 'end' }}>
                    <Button type="primary" htmlType="submit">
                        {isEditMode ? 'Lưu thay đổi' : 'Thêm khoản chi tiêu'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const columns = [
        { title: 'Loại chi tiêu', dataIndex: 'type', key: 'type' },
        { title: 'Số tiền', dataIndex: 'value', key: 'value', render: formatCurrency },
        { title: 'Ngày chi tiêu', dataIndex: 'date', key: 'date' },
        { 
            title: 'Tháng năm', 
            dataIndex: 'date', 
            key: 'monthYear',
            render: (date) => moment(date).format('MM-YYYY') 
        },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => showEditExpenseModal(record)}>
                        <EditOutlined />
                    </Button>
                    <Button danger type="link" onClick={() => handleDeleteExpense(record.id)}>
                        <DeleteOutlined />
                    </Button>
                </span>
            ),
        },
    ];

    const showAddExpenseModal = () => {
        setIsModalVisible(true);
        setIsEditMode(false);
        setCurrentExpense(null);
        form.setFieldsValue({
            type: "",
            value: '',
            date: '',
            note: '',
        });
    };

    const showEditExpenseModal = (expense) => {
        setIsModalVisible(true);
        setIsEditMode(true);
        setCurrentExpense(expense);
        form.setFieldsValue({
            type: expense.type,
            value: formatInputCurrency(expense.value),
            date: moment(expense.date),
            note: expense.note,
        });
    };
    // Add "Tháng" column based on "Ngày nhận"
    const addMonthColumn = (records) => {
        return records.map(record => ({
            ...record,
            month: moment(record.date).format('MM-YYYY'), // Extract "Month-Year" format
        }));
    };

    return (
        <div>
            <Title level={4} style={{ color: '#444' }}>
                Quản lý chi tiêu
            </Title>

            <Row gutter={[12, 12]}>
                {expenseCategories.map((category, index) => (
                    <Col span={8} key={index}>
                        <Card bordered={false}>
                            <div className="statistic-card">
                                <div>
                                    <div className="number_total">
                                        {formatCurrency(
                                            expenseRecords
                                                .filter((record) => record.type === category.name)
                                                .reduce((total, record) => total + record.value, 0)
                                        )}
                                    </div>
                                    <div className="title_total" style={{ color: category.color }}>
                                        {category.name}
                                    </div>
                                </div>
                                <div style={{ alignSelf: 'center' }}>{category.icon}</div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showAddExpenseModal}
                style={{ marginTop: 20, marginBottom: 20, float: 'right' }}
            >
                Thêm chi tiêu
            </Button>

            <Table
                columns={columns}
                dataSource={expenseRecords.map(record => ({
                    ...record,
                    monthYear: moment(record.date).format('MM-YYYY'), // Thêm thuộc tính monthYear
                }))}
                rowKey="id"
                style={{ marginTop: 20 }}
                pagination={{pageSize: 4, total: expenseRecords.length}}
            />

            {renderExpenseModal()}
        </div>
    );
}

export default Expenses;
